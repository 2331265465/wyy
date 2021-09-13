import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, takeUntil} from "rxjs/operators";
import {RecordVal, User, UserSheet} from "../../../services/data-types/member.type";
import {SheetService} from "../../../services/sheet.service";
import {BatchActionsService} from "../../../store/batch-actions.service";
import {MemberService, RecordType, ShareParams} from "../../../services/member.service";
import {Singer, Song} from "../../../services/data-types/common.types";
import {SongService} from "../../../services/song.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../../store/store.module";
import {getCurrentSong, selectPlayer} from "../../../store/selectors/player.selector";
import {findIndex} from "../../../utils/array";
import {Subject} from "rxjs";
import {SetShareInfo} from "../../../store/actions/member.actions";

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterComponent implements OnInit, OnDestroy {
  user: User
  records: RecordVal[]
  userSheet: UserSheet
  recordType = RecordType.weekData
  currentIndex = -1

  private currentSong: Song
  private destroy$ = new Subject()

  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private songServe: SongService,
    private messageServe: NzMessageService,
    private store$: Store<AppStoreModule>,
    private cdr: ChangeDetectorRef
  ) {
    route.data.pipe(map(res => res.user)).subscribe(([user, records, userSheet]) => {
      this.user = user
      this.records = records.slice(0, 10)
      this.userSheet = userSheet
      this.listenCurrentSong()
    })
  }

  ngOnInit(): void {
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionsServe.selectPlayList({list, index: 0})
    })
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type)
        .subscribe(records => this.records = records.slice(0, 10))
    }
  }

  private listenCurrentSong() {
    this.store$.pipe(select(selectPlayer), select(getCurrentSong), takeUntil(this.destroy$)).subscribe(song => {
      this.currentSong = song
      if (song) {
        const songs = this.records.map(item => item.song)
        this.currentIndex = findIndex(songs, song)
      } else {
        this.currentIndex = -1
      }
      this.cdr.markForCheck()
    })
  }

  onAddSong([song, isPlay]: [Song, boolean]) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionsServe.insertSong(list[0], isPlay)
        } else {
          this.messageServe.warning('当前歌曲无音频可播放', {
            nzDuration: 1500,
          })
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onLikeSong(id: string) {
    this.batchActionsServe.likeSong(id)
  }

  onShareSong(resource, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar)
    this.store$.dispatch(SetShareInfo({info: {id: resource.id.toString(), type, txt}}))
  }

  makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/')
    return `${type}:${name} -- ${makeByStr}`
  }
}
