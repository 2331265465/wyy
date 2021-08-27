import { NgModule } from '@angular/core';
import { SingerRoutingModule } from './singer-routing.module';
import {ShareModule} from "../../share/share.module";


@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    SingerRoutingModule
  ]
})
export class SingerModule { }
