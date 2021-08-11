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
import {WINDOW} from "../../../../services/services.module";

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[]
  @Input() currentSong: Song
  currentIndex: number
  @Input() show: boolean

  @Output() onClose = new EventEmitter<void>()
  @Output() onChangeSong = new EventEmitter<Song>()

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>

  scrollY = 0

  constructor(@Inject(WINDOW) private win:Window) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      this.currentIndex = 0
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong)
        if (this.show) {
          this.scrollToCurrent()
        }
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll()
        if (this.currentSong) {
          this.win.setTimeout(() => {
            this.scrollToCurrent(0)
          }, 80)
        }
      }
    }
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

}
