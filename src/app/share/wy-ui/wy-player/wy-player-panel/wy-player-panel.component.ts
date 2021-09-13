import {
  Component,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {findIndex} from 'src/app/utils/array';
import {Song} from "../../../../services/data-types/common.types";
import {WyScrollComponent} from "../wy-scroll/wy-scroll.component";
import {SongService} from "../../../../services/song.service";
import {BaseLyricLine, WyLyric} from "./wy-lyric";
import {timer} from "rxjs";
import {BatchActionsService} from "../../../../store/batch-actions.service";

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[]
  @Input() playing: boolean
  @Input() currentSong: Song
  @Input() show: boolean

  @Output() onClose = new EventEmitter<void>()
  @Output() onChangeSong = new EventEmitter<Song>()
  @Output() onDeleteSong = new EventEmitter<Song>()
  @Output() onClearSong = new EventEmitter<void>()
  @Output() onToInfo = new EventEmitter<[string, number]>()
  @Output() onLikeSong = new EventEmitter<string>()
  @Output() onShareSong = new EventEmitter<Song>()

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>

  scrollY = 0
  currentIndex: number
  currentLyric: BaseLyricLine[] = []
  lyric: WyLyric
  currentLineNum: number
  lyricRefs: NodeList
  startLine = 3

  constructor(private songServe: SongService) {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing)
      }
    }

    if (changes['songList']) {
      if (this.currentSong) {
        this.updateCurrentIndex()
      }
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.updateCurrentIndex()
        this.updateLyric()
        if (this.show) {
          this.scrollToCurrent()
        }
      } else {
        this.resetLyric()
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll()
        this.wyScroll.last.refreshScroll()
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0)
          }
          if (this.lyricRefs) {
            this.scrollToCurrentLyric(0)
          }
        })

      }
    }
  }

  toInfo(e: Event, path: [string, number]) {
    e.stopPropagation()
    this.onToInfo.emit(path)
  }

  private updateCurrentIndex() {
    this.currentIndex = findIndex(this.songList, this.currentSong)
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li')
    if (songListRefs) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0]
      const offsetTop = currentLi.offsetTop
      const offsetHeight = currentLi.offsetHeight
      if ((offsetTop - Math.abs(this.scrollY) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false)
      }
    }
  }

  private scrollToCurrentLyric(speed = 300) {
    if (this.lyricRefs) {
      const targetLine = this.lyricRefs[this.currentLineNum - this.startLine]
      if (targetLine) {
        this.wyScroll.last.scrollToElement(targetLine, speed, false, false)
      }
    }
  }

  private updateLyric() {
    this.resetLyric()
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res)
      this.currentLyric = this.lyric.lines
      this.startLine = res.tlyric ? 0 : 3
      this.handleLyric()
      this.wyScroll.last.scrollTo(0, 0)
      if (this.playing) {
        this.lyric.play()
      }
    })
  }

  handleLyric() {
    this.lyric.handler.subscribe(({lineNum}) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li')
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum
        if (lineNum > this.startLine) {
          this.scrollToCurrentLyric()
        } else {
          this.wyScroll.last.scrollTo(0, 0)
        }
      }
    })
  }

  resetLyric() {
    if (this.lyric) {
      this.lyric.stop()
      this.lyric = null
      this.currentLyric = []
      this.currentLineNum = 0
      this.lyricRefs = null
    }
  }

  seekLyric(time: number) {
    if (this.lyric) {
      this.lyric.seek(time)
    }
  }

  likeSong(e: Event, id: string) {
    e.stopPropagation()
    this.onLikeSong.emit(id)
  }

  shareSong(e: Event, item: Song) {
    e.stopPropagation()
    this.onShareSong.emit(item)
  }
}

