import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ServicesModule} from "../services/services.module";
import {PagesModule} from "../pages/pages.module";
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from '@angular/common';
import {ShareModule} from "../share/share.module";
import {NZ_I18N, zh_CN} from "ng-zorro-antd/i18n";

registerLocaleData(zh);


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    AppRoutingModule,
  ],
  exports:[
    ShareModule,
    AppRoutingModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],

})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被appModule引入')
    }
  }
}
