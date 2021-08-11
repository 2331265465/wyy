import {InjectionToken, NgModule, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

export const API_CONFIG = new InjectionToken('ApiConfigToken')
export const WINDOW = new InjectionToken('WindowToken')

@NgModule({
  declarations: [],
  imports: [
  ],
  providers:[
    {provide: API_CONFIG, useValue:'http://localhost:3000/'},
    {
      provide: WINDOW,
      useFactory(platFormId:Object):Window | Object {
        return isPlatformBrowser(platFormId) ? window : {}
      },
      deps:[PLATFORM_ID]
    }
  ]
})
export class ServicesModule { }
