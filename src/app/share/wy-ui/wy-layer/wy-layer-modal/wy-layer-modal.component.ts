import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Inject, Input, OnChanges,
  OnInit, Output,
  Renderer2, SimpleChanges,
  ViewChild
} from '@angular/core';
import {ModalTypes} from "../../../../store/reducers/member.reducer";
import {
  BlockScrollStrategy,
  Overlay,
  OverlayContainer,
  OverlayKeyboardDispatcher,
  OverlayRef
} from "@angular/cdk/overlay";
import {BatchActionsService} from "../../../../store/batch-actions.service";
import {ESCAPE} from '@angular/cdk/keycodes'
import {DOCUMENT} from "@angular/common";
import {WINDOW} from "../../../../services/services.module";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('showHide',[
      state('show',style({transform:'scale(1)',opacity:1})),
      state('hide',style({transform:'scale(0)',opacity:0})),
      transition('show<=>hide',animate('0.2s'))
    ])
  ]
})
export class WyLayerModalComponent implements OnInit, AfterViewInit,OnChanges {
  private overlayRef: OverlayRef
  private scrollStrategy: BlockScrollStrategy
  private overlayContainerEl: HTMLElement
  private resizeHandler: () => void
  showModal = 'hide'

  @Input() visible = false //弹窗提示
  @Input() currentModalType = ModalTypes.Default //弹窗类型
  @Output() onLoadMySheets = new EventEmitter<void>()
  @ViewChild('modalContainer') private modalContainer: ElementRef

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private window: Window,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsServe: BatchActionsService,
    private rd2: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    this.scrollStrategy = this.overlay.scrollStrategies.block()
  }

  ngOnInit(): void {
    this.createOverlay()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      this.handleVisibleChange(this.visible)
    }
    if (changes['currentModalType']) {

    }
  }

  ngAfterViewInit(): void {
    this.listenerResizeToCenter()
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement()
  }

  private createOverlay() {
    this.overlayRef = this.overlay.create() //创建浮层
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement) //将宿主添加到浮层
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e))  //监听键盘事件
  }

  private keydownListener(e: KeyboardEvent) {
    if (e.keyCode === ESCAPE || e.code === 'Escape' || e.key === 'Escape') {
      this.hide()
    }
  }

  private handleVisibleChange(visible: boolean) {
    if (visible) {
      this.showModal = 'show'
      this.scrollStrategy.enable()
      this.overlayKeyboardDispatcher.add(this.overlayRef)
      this.listenerResizeToCenter()
      this.changePointerEvents('auto')
    } else {
      this.showModal = 'hide'
      this.scrollStrategy.disable()
      this.overlayKeyboardDispatcher.remove(this.overlayRef)
      if (this.resizeHandler) {
        this.resizeHandler()
      }
      this.changePointerEvents('none')
    }
    this.cdr.markForCheck()
  }

  changePointerEvents(type: 'none' | 'auto') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type
    }
  }

  hide() {
    this.batchActionsServe.controlModal(false)
    this.resizeHandler()
  }

  private getHideDomeSize(dom: HTMLElement) {
      return {
        w: dom.offsetWidth,
        h: dom.offsetHeight
      }
  }

  listenerResizeToCenter() {
    const modal = this.modalContainer.nativeElement
    const modalSize = this.getHideDomeSize(modal)
    this.keepCenter(modal, modalSize)
  }

  private keepCenter(modal: HTMLElement, size: { w: number, h: number }) {
      const left = (this.getWindowSize().w - size.w) / 2
      const top = (this.getWindowSize().h - size.h) / 2
      modal.style.left = left + 'px'
      modal.style.top = top + 'px'
      this.resizeHandler = this.rd2.listen('window', 'resize', () => this.keepCenter(modal, size))
  }

  private getWindowSize() {
    return {
      w: this.window.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.window.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    }
  }

}
