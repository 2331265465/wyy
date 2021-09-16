import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzBackTopModule} from "ng-zorro-antd/back-top";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    NzAvatarModule,
    NzProgressModule,
    NzBackTopModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
