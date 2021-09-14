import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy, forwardRef, ChangeDetectorRef
} from '@angular/core';
import {fromEvent, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {BACKSPACE} from "@angular/cdk/keycodes"
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WyCodeComponent),
      multi: true
    }
  ]
})
export class WyCodeComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  inputArr = []
  inputsEl: HTMLElement[]
  result: string[] = []
  private code: string
  currentFocusIndex = 0

  @ViewChild('codeWrap', {static: true}) private el: ElementRef
  private destroy$ = new Subject();

  constructor(private cdr: ChangeDetectorRef) {
    this.inputArr = Array(4).fill('')
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.inputsEl = this.el.nativeElement.querySelectorAll('.item')
    this.inputsEl[0].focus()
    for (let i = 0; i < this.inputsEl.length; i++) {
      const item = this.inputsEl[i]
      fromEvent(item, 'keyup').pipe(takeUntil(this.destroy$)).subscribe((event: KeyboardEvent) => this.listenKeyUp(event))
      fromEvent(item, 'click').pipe(takeUntil(this.destroy$)).subscribe(() => this.currentFocusIndex = i)
    }
  }

  private listenKeyUp(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const isBackSpace = e.keyCode === BACKSPACE || e.code === 'Backspace' || e.key === 'Backspace'
    if (/\D/.test(value)) {
      target.value = '';
      this.result[this.currentFocusIndex] = '';
    } else if (value) {
      this.result[this.currentFocusIndex] = value;
      this.currentFocusIndex = this.currentFocusIndex === 3 ? 3 : this.currentFocusIndex+1
      this.inputsEl[this.currentFocusIndex].focus();
    } else if (isBackSpace) {
      this.result[this.currentFocusIndex] = '';
      this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
      this.inputsEl[this.currentFocusIndex].focus();
    }
    this.checkResult(this.result)
  }
  checkResult(result:string[]) {
    const codeStr = result.join('')
    this.setValue(codeStr)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  private setValue(code: string) {
    console.log(code);
    this.code = code
    this.onValueChange(code)
    this.cdr.markForCheck()
  }

  private onValueChange(value: string): void {}

  private onTouched(): void {}

  registerOnChange(fn: (value: string) => void): void {
    this.onValueChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  writeValue(value: string): void {
    this.setValue(value)
  }

}
