import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal'
@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  entryComponents:[WySearchPanelComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    OverlayModule,
    PortalModule
  ],
  exports:[WySearchComponent]
})
export class WySearchModule { }
