import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzLayoutModule} from 'ng-zorro-antd/layout'
import {CommonModule} from "@angular/common";



@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    NzButtonModule,
    CommonModule,
    NzLayoutModule,
  ],
  exports:[
    FormsModule,
    NzButtonModule,
    CommonModule,
    NzLayoutModule,
  ]
})
export class ShareModule { }
