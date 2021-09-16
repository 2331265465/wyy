import {InjectionToken, NgModule, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {httpInterceptorProviders} from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {provide: API_CONFIG, useValue: '/api/'},
    {
      provide: WINDOW,
      useFactory(platformId: object): Window | object {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [PLATFORM_ID]
    },
    httpInterceptorProviders
  ]
})
export class ServicesModule {
}
