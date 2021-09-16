import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonInterceptor} from './common.interceptor';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CommonInterceptor,
    multi: true
  }
];
