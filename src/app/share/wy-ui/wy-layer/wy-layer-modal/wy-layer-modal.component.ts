import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit, Renderer2, Inject
} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../../../store/store.module";
import {getModalType, getModalVisible, selectMember} from "../../../../store/selectors/member.selector";
import {ModalTypes} from "../../../../store/reducers/member.reducer";
import {
  Overlay,
  OverlayRef,
  OverlayKeyboardDispatcher,
  BlockScrollStrategy,
  OverlayContainer
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
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  private visible = false
  private overlayRef: OverlayRef
  private scrollStrategy: BlockScrollStrategy
  private overlayContainerEl: HTMLElement
  private resizeHandler: () => void

  currentModalType = ModalTypes.Default
  showModal = 'hide'


  @ViewChild('modalContainer') private modalContainer: ElementRef

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private window: Window,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsServe: BatchActionsService,
    private rd2: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    const appStore$ = this.store$.pipe(select(selectMember))
    appStore$.pipe(select(getModalVisible)).subscribe(visible => this.watchModalVisible(visible))
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type))
    this.scrollStrategy = this.overlay.scrollStrategies.block()
  }

  ngOnInit(): void {
    this.createOverlay()
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

  private watchModalVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible
      this.handleVisibleChange(visible)
    }
  }

  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      this.currentModalType = type
      this.cdr.markForCheck()
    }
  }

  private handleVisibleChange(visible: boolean) {
    if (visible) {
      this.showModal = 'show'
      this.listenerResizeToCenter()
      this.scrollStrategy.enable()
      this.overlayKeyboardDispatcher.add(this.overlayRef)
      this.changePointerEvents('auto')
    } else {
      this.showModal = 'hide'
      this.scrollStrategy.disable()
      this.overlayKeyboardDispatcher.remove(this.overlayRef)
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
