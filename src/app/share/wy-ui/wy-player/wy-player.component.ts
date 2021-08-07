import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../../store/store.module";
import {
  getCurrentIndex,
  getCurrentSong,
  getPlayList,
  getPlayMode,
  getSongList,
  selectPlayer
} from "../../../store/selectors/player.selector";
import {Song} from "../../../services/data-types/common.types";
import {PlayMode} from "./player-type";
import {SetCurrentIndex} from "../../../store/actions/player.actions";

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 35
  bufferOffset = 70

  songList: Song[]
  playList: Song[]
  currentIndex: number
  currentSong: Song

  duration: number
  currentTime: number

  playing = false //播放状态
  songReady = false //是否可以播放
  @ViewChild('audio', {static: true}) private audio: ElementRef
  private audioEl: HTMLAudioElement

  constructor(private store$: Store<AppStoreModule>) {
    const appStore$ = store$.select(selectPlayer)
    const stateArr = [
      {
        type: getSongList,
        callback: list => this.watchPlayList(list, 'songList')
      },
      {
        type: getPlayList,
        callback: list => this.watchSongList(list, 'playlist')
      },
      {
        type: getCurrentIndex,
        callback: index => this.watchCurrentIndex(index, 'currentIndex')
      },
      {
        type: getPlayMode,
        callback: mode => this.watchPlayMode(mode)
      },
      {
        type: getCurrentSong,
        callback: song => this.watchCurrentSong(song)
      },
    ]
    stateArr.forEach((item: { type: any, callback: () => void }) => {
      appStore$.pipe(select(item.type)).subscribe(item.callback)
    })
  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement
  }

  private watchSongList(list: Song[], type: string) {
    console.log(list)
    this.songList = list
  }

  private watchPlayList(list: Song[], type: string) {
    console.log(list)
    this.playList = list
  }

  private watchCurrentIndex(index: number, type: string) {
    console.log(index)
    this.currentIndex = index
  }

  private watchPlayMode(mode: PlayMode) {
    // this.mode = mode
  }

  private watchCurrentSong(song: Song) {
    console.log(song)
    if (song) {
      this.currentSong = song
      this.duration = song.dt / 1000
    }
  }

  onCanplay() {
    this.songReady = true
    this.play()
  }

  private play() {
    this.audioEl.play()
    this.playing = true
  }
  // private pause() {
  //   this.audioEl.pause()
  //   this.playing = false
  // }
  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg'
  }

  onTimeUpdate(e: Event) {
    const target = <HTMLAudioElement>e.target
    this.currentTime = target.currentTime

  }

  onToggle() {
    if (this.currentSong) {
      if (this.songReady) {
        this.playing = !this.playing
        if (this.playing) {
          this.audioEl.play()
        }else {
          this.audioEl.pause()
        }
      }
    }else {
      if (this.playList.length) {
        this.updateIndex(0)
      }
    }
  }
  //上一首
  onPrev(index:number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop()
    }else {
      const newIndex = index <= 0 ? this.playList.length - 1 : index
      this.updateIndex(newIndex)
    }
  }
  //下一首
  onNext(index:number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop()
    }else {
      const newIndex = index >= this.playList.length ? 0 : index
      this.updateIndex(newIndex)
    }
  }
  //单曲循环
  loop() {
    this.audioEl.currentTime = 0
    this.play()
  }
  private updateIndex(index:number) {
    this.store$.dispatch(SetCurrentIndex({currentIndex:index}))
    this.songReady = false
  }

  onPercentChange(e:Event) {
    console.log()
  }
}
