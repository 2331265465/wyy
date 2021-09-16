import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appImgDefault]'
})
export class ImgDefaultDirective {

  constructor() { }
  @HostListener('mousedown',['$event']) onmousedown(event:Event) {
    event.preventDefault()
  }
}
