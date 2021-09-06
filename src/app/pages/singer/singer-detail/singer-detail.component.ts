import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, takeUntil} from "rxjs/operators";
import {Singer, SingerDetail, Song} from "../../../services/data-types/common.types";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../../store/store.module";
import {SongService} from "../../../services/song.service";
import {BatchActionsService} from "../../../store/batch-actions.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {getCurrentSong, selectPlayer} from "../../../store/selectors/player.selector";
import {findIndex} from "../../../utils/array";
import {Subject} from "rxjs";

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit,OnDestroy {
  singerDetail: SingerDetail
  currentIndex = -1
  currentSong:Song
  destroy$ = new Subject<void>()
  simiSingers: Singer[]

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(([singerDetail,singer]) => {
      this.singerDetail = singerDetail
      this.simiSingers = singer
      this.listenCurrent()
    })
  }

  ngOnInit(): void {
  }

  private listenCurrent() {
    this.store$.pipe(select(selectPlayer),select(getCurrentSong),takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song
        if (song) {
          this.currentIndex = findIndex(this.singerDetail.hotSongs,song)
        }else {
          this.currentIndex = -1
        }
      })
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({list, index: 0})
        }else {
         this.batchActionServe.insertSongs(list)
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onAddSong(song: Song, isPlay= false) {
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
}
