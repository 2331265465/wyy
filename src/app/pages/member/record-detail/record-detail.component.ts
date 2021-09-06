import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, takeUntil} from "rxjs/operators";
import {RecordVal, User} from "../../../services/data-types/member.type";
import {MemberService, RecordType} from "../../../services/member.service";
import {Song} from "../../../services/data-types/common.types";
import {Subject} from "rxjs";
import {SheetService} from "../../../services/sheet.service";
import {BatchActionsService} from "../../../store/batch-actions.service";
import {SongService} from "../../../services/song.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../../store/store.module";
import {getCurrentSong, selectPlayer} from "../../../store/selectors/player.selector";
import {findIndex} from "../../../utils/array";

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styles:[
    `
        .record-detail .page-wrap{
          padding: 40px;
        }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailComponent implements OnInit,OnDestroy {
  user: User
  records: RecordVal[]
  recordType = RecordType.weekData
  currentIndex = -1

  private currentSong:Song
  private destroy$ = new Subject()

  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private songServe:SongService,
    private messageServe:NzMessageService,
    private store$:Store<AppStoreModule>,
    private cdr:ChangeDetectorRef
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user,userRecord]) => {
      this.user = user
      this.records = userRecord
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
        .subscribe(records => this.records = records)
    }
  }

  private listenCurrentSong() {
    this.store$.pipe(select(selectPlayer),select(getCurrentSong),takeUntil(this.destroy$)).subscribe(song => {
      this.currentSong = song
      if (song) {
        const songs = this.records.map(item => item.song)
        this.currentIndex = findIndex(songs,song)
      }else {
        this.currentIndex = -1
      }
      this.cdr.markForCheck()
    })
  }

  onAddSong([song, isPlay]:[Song,boolean]) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionsServe.insertSong(list[0],isPlay)
        }else {
          this.messageServe.warning('当前歌曲无音频可播放',{
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

}
