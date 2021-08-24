import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import {SongSheet} from "../../services/data-types/common.types";
import {SheetService} from "../../services/sheet.service";

@Injectable({
  providedIn: 'root'
})
export class SheetInfoResolver implements Resolve<SongSheet> {

  constructor(private sheetServe:SheetService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
    return this.sheetServe.getSongSheetDetail(Number(route.paramMap.get('id')))
  }
}
