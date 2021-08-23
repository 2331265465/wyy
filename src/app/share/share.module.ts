import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzLayoutModule} from 'ng-zorro-antd/layout'
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import {CommonModule} from "@angular/common";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzIconModule} from "ng-zorro-antd/icon";
import {WyUiModule} from "./wy-ui/wy-ui.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzPaginationModule} from "ng-zorro-antd/pagination";

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    NzButtonModule,
    CommonModule,
    NzLayoutModule,
    NzCarouselModule,
    NzInputModule,
    NzMenuModule,
    NzIconModule,
    WyUiModule,
    NzModalModule,
    NzRadioModule,
    NzPaginationModule,
  ],
  exports: [
    FormsModule,
    NzButtonModule,
    CommonModule,
    NzLayoutModule,
    NzCarouselModule,
    NzInputModule,
    NzMenuModule,
    NzIconModule,
    WyUiModule,
    NzModalModule,
    NzRadioModule,
    NzPaginationModule,
  ]
})
export class ShareModule { }
