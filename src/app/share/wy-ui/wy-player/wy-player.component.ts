import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../../store/store.module";
import {
  getCurrentAction,
  getCurrentIndex,
  getCurrentSong,
  getPlayList,
  getPlayMode,
  getSongList,
  selectPlayer
} from "../../../store/selectors/player.selector";
import {Song} from "../../../services/data-types/common.types";
import {PlayMode} from "./player-type";
import {SetCurrentAction, SetCurrentIndex, SetPlayList, SetPlayMode} from "../../../store/actions/player.actions";
import {DOCUMENT} from "@angular/common";
import {findIndex, shuffle} from "../../../utils/array";
import {WyPlayerPanelComponent} from "./wy-player-panel/wy-player-panel.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {BatchActionsService} from "../../../store/batch-actions.service";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger, AnimationEvent} from "@angular/animations";
import {CurrentActions} from "../../../store/reducers/player.reducer";
import {timer} from "rxjs";

const modeTypes: PlayMode[] = [
  {type: 'loop', label: '循环'},
  {type: 'random', label: '随机'},
  {type: 'singleLoop', label: '单曲循环'},
]

enum TipTitles {
  Add = '已添加到列表',
  Play = '已开始播放'
}

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  animations: [
    trigger('showHide', [
      state('show', style({bottom: 0})),
      state('hide', style({bottom: -71})),
      transition('show=>hide', [animate('0.3s')]),
      transition('hide=>show', [animate('0.1s')])
    ])
  ]
})
export class WyPlayerComponent implements OnInit {
  showPlayer = 'hide' //动画状态
  isLocked = false //播放器是否上锁
  animating = false //是否正在执行动画

  controlToolTip = {
    title: '',
    show: false
  }

  percent = 0
  bufferPercent = 0

  songList: Song[]
  playList: Song[]
  currentIndex: number
  currentSong: Song

  duration = 0
  currentTime: number
  volume = 5 //音量百分比
  showVolumePanel = false //是否显示音量面板
  playing = false //播放状态
  songReady = false //是否可以播放
  bindFlag = false //是否绑定document click事件
  currentMode: PlayMode //当前模式
  modeCount = 0 //点击模式多少次
  showPanel = false
  @ViewChild('audio', {static: true}) private audio: ElementRef
  @ViewChild(WyPlayerPanelComponent, {static: false}) private playerPanel: WyPlayerPanelComponent
  private audioEl: HTMLAudioElement

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private batchActionsServe: BatchActionsService,
    private router: Router
  ) {
    const appStore$ = store$.select(selectPlayer)
    const stateArr = [
      {
        type: getSongList,
        callback: list => this.watchPlayList(list)
      },
      {
        type: getPlayList,
        callback: list => this.watchSongList(list)
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
      {
        type: getCurrentAction,
        callback: action => this.watchCurrentAction(action)
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

  togglePanel(type: string) {
    this[type] = !this[type]
    this.bindFlag = this.showVolumePanel || this.showPanel
  }

  onChangeVolume(per: number) {
    this.audioEl.volume = per / 100
  }

  private watchSongList(list: Song[]) {
    this.songList = list
  }

  private watchPlayList(list: Song[]) {
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
      }
      this.updateCurrentIndex(list, this.currentSong)
      this.store$.dispatch(SetPlayList({playList: list}))
    }
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song
    if (song) {
      this.duration = song.dt / 1000
    }
  }

  private watchCurrentAction(action: CurrentActions) {
    const title = TipTitles[CurrentActions[action]]
    if (title) {
      this.controlToolTip.title = title
      if (this.showPlayer === 'hide') {
        this.togglePlayer('show')
      } else {
        this.showToolTip()
      }
    }
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Other}))
  }

  private showToolTip() {
    this.controlToolTip.show = true
    timer(2000).subscribe(() => this.controlToolTip = {title: '', show: false})
  }

  onAnimateDone(e: AnimationEvent) {
    this.animating = false
    if (e.toState === 'show' && this.controlToolTip.title) {
      this.showToolTip()
    }
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list, song)
    this.store$.dispatch(SetCurrentIndex({currentIndex: newIndex}))
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
    } else {
      this.onNext(this.currentIndex + 1)
    }
  }

  //单曲循环
  loop() {
    this.audioEl.currentTime = 0
    this.play()
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0)
    }
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
      const currentTime = this.duration * (pre / 100)
      this.audioEl.currentTime = currentTime
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000)
      }

    }
  }

  //切换歌曲
  changeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song)
  }

  //删除歌曲
  onDeleteSong(song: Song) {
    this.batchActionsServe.deleteSong(song)
  }

  //清空歌曲
  onClearSong() {
    this.nzModalServe.confirm({
      nzTitle: '确认清空列表?',
      nzOnOk: () => {
        this.batchActionsServe.clearSong()
      }
    })
  }

  onClickOutSide(target:HTMLElement) {
    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false
      this.showPanel = false
      this.bindFlag = false
    }
  }

  toInfo(path: [string, number]) {
    this.showPanel = false
    this.showVolumePanel = false
    if (path[1]) {
      this.router.navigate(path)
    }
  }

  togglePlayer(type: string) {
    if (!this.isLocked && !this.animating) {
      this.showPlayer = type
    }
  }
  //播放错误
  onError() {
    this.playing = false
    this.bufferPercent = 0
    this.duration = 0
  }
}
