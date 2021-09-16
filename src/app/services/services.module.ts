import {InjectionToken, NgModule} from '@angular/core';
import {httpInterceptorProviders} from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {provide: API_CONFIG, useValue: '/api/'},
    httpInterceptorProviders
  ]
})
export class ServicesModule {
}
