import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {SingerDetail} from "../../../services/data-types/common.types";
import {SingerService} from "../../../services/singer.service";

@Injectable({
  providedIn: 'root'
})
export class SingerResolver implements Resolve<SingerDetail> {
  constructor(private singerServe:SingerService) {
  }
  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
    const id = route.paramMap.get('id')
    return this.singerServe.getSingerDetail(id)
  }
}
