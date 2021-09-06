import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {Singer, SingerDetail} from "../../../services/data-types/common.types";
import {SingerService} from "../../../services/singer.service";
import {first} from "rxjs/operators";
type SingerDetailDataModel = [SingerDetail,Singer[]]
@Injectable({
  providedIn: 'root'
})
export class SingerResolver implements Resolve<SingerDetailDataModel> {
  constructor(private singerServe:SingerService) {
  }
  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
    const id = route.paramMap.get('id')
    return forkJoin([
      this.singerServe.getSingerDetail(id),
      this.singerServe.getSimiSinger(id),
    ]).pipe(first())
  }
}
