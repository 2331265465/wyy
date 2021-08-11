import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
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
import {SetCurrentIndex, SetPlayList, SetPlayMode} from "../../../store/actions/player.actions";
import {fromEvent, Subscription} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {findIndex, shuffle} from "../../../utils/array";

const modeTypes: PlayMode[] = [
  {type: 'loop', label: '循环'},
  {type: 'random', label: '随机'},
  {type: 'singleLoop', label: '单曲循环'},
]

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  percent = 0
  bufferPercent = 0

  songList: Song[]
  playList: Song[]
  currentIndex: number
  currentSong: Song

  duration = 0
  currentTime: number
  volume = 60 //音量百分比
  showVolumePanel = false //是否显示音量面板
  playing = false //播放状态
  songReady = false //是否可以播放
  selfClick = false //是否点击的是音量面板本身
  private winClick: Subscription
  currentMode: PlayMode //当前模式
  modeCount = 0 //点击模式多少次
  showPanel = false
  @ViewChild('audio', {static: true}) private audio: ElementRef
  private audioEl: HTMLAudioElement

  constructor(private store$: Store<AppStoreModule>, @Inject(DOCUMENT) private doc: Document) {
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
        callback: index => this.watchCurrentIndex(index)
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

  toggleVolPanel() {
    this.togglePanel('showVolumePanel')
  }
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showPanel')
    }
  }

  togglePanel(type:string) {
    this[type] = !this[type]
    if (this.showVolumePanel || this.showPanel) {
      this.bindDocumentClickListener()
    } else {
      this.unBindDocumentClickListener()
    }
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) { //说明点击了播放器以外的部分
          this.showVolumePanel = false
          this.showPanel = false
          this.unBindDocumentClickListener()
        }
        this.selfClick = false
      })
    }
  }

  unBindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe()
      this.winClick = null
    }
  }

  onChangeVolume(per: number) {
    this.audioEl.volume = per / 100
  }

  private watchSongList(list: Song[], type: string) {
    this.songList = list
  }

  private watchPlayList(list: Song[], type: string) {
    this.playList = list
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index
  }

  private watchPlayMode(mode: PlayMode) {
    this.currentMode = mode
    if (this.songList) {
      let list = this.songList.slice()
      if (mode.type === 'random') {
        list = shuffle(this.songList)
        this.updateCurrentIndex(list, this.currentSong)
        this.store$.dispatch(SetPlayList({playList: list}))
      }
    }
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list,song)
    this.store$.dispatch(SetCurrentIndex({currentIndex: newIndex}))
  }

  private watchCurrentSong(song: Song) {
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

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg'
  }

  onTimeUpdate(e: Event) {
    const target = <HTMLAudioElement>e.target
    this.percent = (this.currentTime / this.duration) * 100
    this.currentTime = target.currentTime
    const buffered = this.audioEl.buffered
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100
    }
  }

  onToggle() {
    if (this.currentSong) {
      if (this.songReady) {
        this.playing = !this.playing
        if (this.playing) {
          this.audioEl.play()
        } else {
          this.audioEl.pause()
        }
      }
    } else {
      if (this.playList.length) {
        this.updateIndex(0)
      }
    }
  }

  //上一首
  onPrev(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop()
    } else {
      const newIndex = index < 0 ? this.playList.length - 1 : index
      this.updateIndex(newIndex)
    }
  }

  //下一首
  onNext(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop()
    } else {
      const newIndex = index >= this.playList.length ? 0 : index
      this.updateIndex(newIndex)
    }
  }

  //播放结束
  onEnded() {
    this.playing = false
    if (this.currentMode.type === 'singleLoop') {
      this.loop()
    }else {
      this.onNext(this.currentIndex + 1)
    }
  }

  //单曲循环
  loop() {
    this.audioEl.currentTime = 0
    this.play()
  }

  //改变播放模式
  changeMode() {
    this.store$.dispatch(SetPlayMode({playMode: modeTypes[++this.modeCount % 3]}))
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({currentIndex: index}))
    this.songReady = false
  }

  onPercentChange(pre: number) {
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (pre / 100)
    }
  }

  //切换歌曲
  changeSong(song:Song) {
    this.updateCurrentIndex(this.playList,song)
  }
}
