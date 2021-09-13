import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {RecordVal} from "../../../../../services/data-types/member.type";
import {RecordType} from "../../../../../services/member.service";
import {Singer, Song} from "../../../../../services/data-types/common.types";
import {SetShareInfo} from "../../../../../store/actions/member.actions";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent implements OnInit {
  @Input() records: RecordVal[]
  @Input() recordType = RecordType.weekData
  @Input() listenSongs = 0
  @Input() currentIndex = -1
  @Output() onChangeType = new EventEmitter<RecordType>()
  @Output() onAddSong = new EventEmitter<[Song, boolean]>()
  @Output() onLikeSong = new EventEmitter<string>()
  @Output() onShareSong = new EventEmitter<Song>()

  constructor() {
  }

  ngOnInit(): void {
  }

}
