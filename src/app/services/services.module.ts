import {InjectionToken, NgModule, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

export const API_CONFIG = new InjectionToken('ApiConfigToken')
export const WINDOW = new InjectionToken('WindowToken')

@NgModule({
  declarations: [],
  imports: [
  ],
  providers:[
    {provide: API_CONFIG, useValue:'http://localhost:3000/'}
  ]
})
export class ServicesModule { }
