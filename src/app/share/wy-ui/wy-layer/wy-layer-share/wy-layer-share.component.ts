import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {ShareInfo} from "../../../../store/reducers/member.reducer";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ShareParams} from "../../../../services/member.service";
import {codeJson} from "../../../../utils/base64";

const Max_Msg = 140

@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit,OnChanges {
  @Input() shareInfo: ShareInfo
  @Input() visible = false
  @Output() onCancel = new EventEmitter<void>()
  @Output() onShare = new EventEmitter<ShareParams>()

  formModel: FormGroup
  surplusMsgCount = Max_Msg

  constructor(private fb: FormBuilder) {
    this.formModel = fb.group({
      msg: ['', Validators.maxLength(Max_Msg)]
    })
    this.formModel.get('msg').valueChanges.subscribe(msg => this.surplusMsgCount = Max_Msg - msg?.length)
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const visible = changes['visible']
    if (visible && !visible.firstChange) {
      this.formModel.markAllAsTouched()
    }
  }

  share() {
    if (this.formModel.valid) {
      this.onShare.emit({
        id: this.shareInfo.id,
        type: this.shareInfo.type,
        msg: this.formModel.value.msg
      })
      this.formModel.reset()
    }
  }
}
