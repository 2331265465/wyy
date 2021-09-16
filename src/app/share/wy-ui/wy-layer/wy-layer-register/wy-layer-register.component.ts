import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef, OnChanges, SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../../../services/member.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {interval} from "rxjs";
import {take} from "rxjs/operators";
import {ModalTypes} from "../../../../store/reducers/member.reducer";

enum Exist {
  '存在',
  '不存在'
}

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit,OnChanges {
  @Input() visible = false
  @Output() onChangeModalType = new EventEmitter<string | void>()
  @Output() onRegister = new EventEmitter<void>()
  formModel: FormGroup
  timing = 60
  showCode = false
  codePass: string | boolean = ''

  constructor(
    private fb: FormBuilder,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private cdr: ChangeDetectorRef
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
      this.sendCode(this.formModel.value.phone)
    }
  }

  sendCode(phone: number) {
    this.memberServe.sendCode(phone).subscribe(() => {
      if (!this.showCode) {
        this.showCode = true
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

  changeType(type = ModalTypes.Default) {
    this.onChangeModalType.emit(type)
    this.showCode = false
    this.formModel.reset()
  }

  onCheckCode(code: string) {
    this.memberServe.checkCode(this.formModel.value.phone, Number(code))
      .subscribe(
        () => this.codePass = true,
        () => this.codePass = false,
        () => this.cdr.markForCheck()
      )
  }

  onCheckExist(phone: string) {
    this.memberServe.checkExist(Number(phone)).subscribe(res => {
      if (Exist[res] === '存在') {
        this.messageServe.error('账号已存在,可直接登陆')
        this.changeType(ModalTypes.LoginByPhone)
      } else {
        this.onRegister.emit()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !changes['visible'].firstChange) {
      this.formModel.markAllAsTouched()
      if (!this.visible) {
        this.showCode = false
      }
    }
  }
}
