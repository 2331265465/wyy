import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, takeUntil} from "rxjs/operators";
import {Singer, Song} from "../../services/data-types/common.types";
import {BaseLyricLine, WyLyric} from "../../share/wy-ui/wy-player/wy-player-panel/wy-lyric";
import {BatchActionsService} from "../../store/batch-actions.service";
import {SongService} from "../../services/song.service";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../store/store.module";
import {NzMessageService} from "ng-zorro-antd/message";
import {Subject} from "rxjs";
import {getCurrentSong, selectPlayer} from "../../store/selectors/player.selector";
import {SetShareInfo} from "../../store/actions/member.actions";

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit,OnDestroy {
  song: Song
  lyric: BaseLyricLine[]
  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }
  currentSong:Song
  private destroy$ = new Subject<void>()
  constructor(
    private route: ActivatedRoute,
    private batchActionServe:BatchActionsService,
    private songServe:SongService,
    private store$:Store<AppStoreModule>,
    private messageServe:NzMessageService
    ) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song
      this.lyric = new WyLyric(lyric).lines
      this.listenCurrent()
    })
  }

  ngOnInit(): void {
  }

  toggleLyric() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起'
      this.controlDesc.iconCls = 'up'
    } else {
      this.controlDesc.label = '展开'
      this.controlDesc.iconCls = 'down'
    }
  }

  private listenCurrent() {
    this.store$.pipe(select(selectPlayer),select(getCurrentSong),takeUntil(this.destroy$))
      .subscribe(song => this.currentSong = song)
  }

  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0],isPlay)
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

  likeSong(id: string) {
    this.batchActionServe.likeSong(id)
  }

  shareSong(resource: Song,type = 'song') {
    const txt = this.makeTxt('歌曲',resource.name,resource.ar)
    this.store$.dispatch(SetShareInfo({info: {id: resource.id.toString(), type, txt} }))
  }

  makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map(item => item.name).join('/')
    return `${type}:${name} -- ${makeByStr}`
  }
}
