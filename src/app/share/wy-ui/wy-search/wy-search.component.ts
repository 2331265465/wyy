import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, pluck} from "rxjs/operators";
import {SearchResult} from "../../../services/data-types/common.types";
import {isObject} from "../../../utils/tools";
import {Overlay, OverlayRef} from '@angular/cdk/overlay'
import {ComponentPortal} from '@angular/cdk/portal'
import {WySearchPanelComponent} from "./wy-search-panel/wy-search-panel.component";

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customView: TemplateRef<HTMLElement>
  @Input() searchResult: SearchResult
  @Input() connectedRef: ElementRef
  @Output() onSearch = new EventEmitter<string>()

  @ViewChild('nzInput', {static: false}) private nzInput: ElementRef
  @ViewChild('search', {static: false}) private defaultRef: ElementRef


  private overlayRef: OverlayRef

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement, 'input')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.onSearch.emit(value)
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && !changes['searchResult'].firstChange) {
      if (!isObject(this.searchResult)) {
        this.showOverplayPanel()
      }else {
        this.hideOverplayPanel()
      }
    }
  }

  private hideOverplayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.dispose()
    }
  }

  private showOverplayPanel() {
    this.hideOverplayPanel()
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.connectedRef || this.defaultRef)
      .withPositions([{
        originX:'start',
        originY:'bottom',
        overlayX:'start',
        overlayY:'top',
      }]).withLockedPosition(true)

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    })
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef)
    const panelRef = this.overlayRef.attach(panelPortal)
    panelRef.instance.searchResult = this.searchResult
  }

  onFocus() {
    if (this.searchResult && !isObject(this.searchResult)) {
      this.showOverplayPanel()
    }
  }

  onBlur() {
    this.hideOverplayPanel()
  }
}
