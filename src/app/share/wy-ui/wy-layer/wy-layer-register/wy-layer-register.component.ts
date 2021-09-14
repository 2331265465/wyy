import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../../../services/member.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {interval} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit {
  @Input() visible = false
  @Output() onChangeModalType = new EventEmitter<string | void>()
  formModel: FormGroup
  timing = 60
  showCode = true
  constructor(
    private fb: FormBuilder,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private cdr:ChangeDetectorRef
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.formModel.valid) {
      console.log(1);
      this.sendCode(this.formModel.value.phone)
    }
  }

  private sendCode(phone: number) {
    this.memberServe.sendCode(phone).subscribe(() => {
      if (!this.showCode) {
        this.showCode = true
        console.log(this.showCode);
      }
      interval(1000).pipe(take(60)).subscribe(() => {
        this.timing--
        this.cdr.markForCheck()
      })
      this.cdr.markForCheck()
    }, error => {
      this.messageServe.error(error.msg || '发送失败')
    })
  }

  changeType() {
    this.onChangeModalType.emit('Default')
    this.showCode = false
    this.formModel.reset()
  }
}
