import {ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SongSheet} from "../../../services/data-types/common.types";

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet
  @Output() onPlay = new EventEmitter<any>()

  constructor() {
  }

  ngOnInit(): void {
  }

  playSheet(e:MouseEvent,id:number) {
    e.stopPropagation()
    this.onPlay.emit(id)
  }

  get coverImg():string {
    return this.sheet.picUrl || this.sheet.coverImgUrl
  }
}
