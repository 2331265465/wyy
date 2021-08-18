import {
  Directive,
  ElementRef,
  Inject,
  Output,
  Renderer2,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges{

  private handleClick: () => void;

  @Input() bindFlag = false
  @Output() onClickOutSide = new EventEmitter<void>()

  constructor(private el: ElementRef, private rd2: Renderer2, @Inject(DOCUMENT) private doc: Document) {
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['bindFlag'] && !changes['bindFlag'].firstChange) {
      if (this.bindFlag) {
        this.handleClick = this.rd2.listen(this.doc, 'click', e => {
          const isContain = this.el.nativeElement.contains(e.target)
          if (!isContain) {
            this.onClickOutSide.emit()
          }
        })
      }else {
        this.handleClick()
      }
    }
  }

}
