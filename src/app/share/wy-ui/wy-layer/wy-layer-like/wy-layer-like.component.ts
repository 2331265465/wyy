import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import {SongSheet} from "../../../../services/data-types/common.types";
import {LikeSongPid} from "../../../../services/member.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input() mySheets: SongSheet[]
  @Input() likeId: string
  @Input() visible: boolean
  @Output() onLikeSong = new EventEmitter<LikeSongPid>();
  @Output() onCreateSheet = new EventEmitter<string>();
  creating: boolean;
  formModel:FormGroup
  constructor(private fb:FormBuilder) {
    this.formModel = this.fb.group({
      sheetName:['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (!this.visible) {
        this.creating = false
        this.formModel.reset()
      }
    }

  }

  onLike(pid: string) {
    this.onLikeSong.emit({pid, tracks: this.likeId})
  }

  onSubmit() {
    this.onCreateSheet.emit(this.formModel.value.sheetName)
  }
}
