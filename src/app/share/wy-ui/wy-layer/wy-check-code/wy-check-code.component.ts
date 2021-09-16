import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
  private phoneHideStr = ''
  formModel: FormGroup
  showRepeatBtn: boolean
  showErrorTip = false
  @Input() codePass = false
  @Input() timing = 60
  @Input()
  set phone(phone: string) {
    const arr = phone.split('')
    arr.splice(3, 4, '****')
    this.phoneHideStr = arr.join('')
  }

  get phone() {
    return this.phoneHideStr
  }

  @Output() onCheckCode = new EventEmitter<string>()
  @Output() onRepeatSendCode= new EventEmitter<void>()
  @Output() onCheckExist = new EventEmitter<string>()

  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/\d{4}/)]]
    })
    const codeControl = this.formModel.get('code')
    codeControl.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.checkCode(this.formModel.value.code)
      }
    })
  }

  ngOnInit(): void {
  }


  onSubmit() {
    //检测是否已注册
    if (this.formModel.valid && this.codePass) {
      this.onCheckExist.emit(this.phone)
    }
  }

  private checkCode(code: string) {
    this.onCheckCode.emit(code)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timing']) {
      this.showRepeatBtn = this.timing <= 0;
    }
    if (changes['codePass'] && !changes['codePass'].firstChange) {
      this.showErrorTip = !this.codePass
    }
  }
}
