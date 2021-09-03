import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    NzAvatarModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
