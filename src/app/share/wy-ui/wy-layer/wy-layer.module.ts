import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WyLayerModalComponent} from './wy-layer-modal/wy-layer-modal.component';
import {WyLayerDefaultComponent} from './wy-layer-default/wy-layer-default.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {WyLayerLoginComponent} from './wy-layer-login/wy-layer-login.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzListModule} from "ng-zorro-antd/list";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzIconModule} from "ng-zorro-antd/icon";
import {WyLayerLikeComponent} from './wy-layer-like/wy-layer-like.component';

@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent, WyLayerLikeComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    FormsModule,
    DragDropModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzAlertModule,
    NzListModule,
    NzSpinModule,
    NzIconModule
  ],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent, WyLayerLikeComponent]
})
export class WyLayerModule {
}
