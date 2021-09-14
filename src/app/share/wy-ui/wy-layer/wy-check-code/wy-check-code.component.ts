import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit {
  private phoneHideStr = ''
  formModel: FormGroup

  @Input()
  set phone(phone: string) {
    const arr = phone.split('')
    arr.splice(3, 4, '****')
    this.phoneHideStr = arr.join('')
  }

  get phone() {
    return this.phoneHideStr
  }

  constructor(private fb: FormBuilder) {
    // this.formModel = this.fb.group({
    //   code: ['', Validators.required]
    // })
  }

  ngOnInit(): void {
  }


}
