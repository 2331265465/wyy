import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {codeJson} from "../../../../utils/base64";

export type LoginParams = {
  phone: string
  password: string
  remember: boolean
}

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit, OnChanges {
  @Output() onChangeModalType = new EventEmitter<string | void>()
  @Output() onLogin = new EventEmitter<LoginParams>()
  @Input() wyRememberLogin: LoginParams
  @Input() visible = false

  formModel: FormGroup

  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      phone: ['', [
        Validators.required,
        Validators.pattern(/^1\d{10}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      remember: [false]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const modal = this.formModel
    if (modal.valid) {
      this.onLogin.emit(modal.value)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes['wyRememberLogin']
    const visible = changes['visible']
    if (changes['wyRememberLogin']) {
      let phone = ''
      let password = ''
      let remember = false
      const value = codeJson(userLoginParams.currentValue,'decode')
      if (userLoginParams.currentValue) {
        phone = value.phone
        password = value.password
        remember = value.remember
        this.setModal({phone, password, remember})
      }
    }
    if (visible && !visible.firstChange) {
      this.formModel.markAllAsTouched()
    }
  }

  private setModal({phone, password, remember}: LoginParams) {
    this.formModel = this.fb.group({
      phone: [phone, [
        Validators.required,
        Validators.pattern(/^1\d{10}$/)
      ]],
      password: [password, [
        Validators.required,
        Validators.minLength(6)
      ]],
      remember: [remember]
    })
  }
}
