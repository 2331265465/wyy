import {InjectionToken, NgModule} from '@angular/core';
import {httpInterceptorProviders} from './http-interceptors';
import {environment} from "../../environments/environment.prod";

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {provide: API_CONFIG, useValue: environment.production ? '/' : '/api/'},
    httpInterceptorProviders
  ]
})
export class ServicesModule {
}
