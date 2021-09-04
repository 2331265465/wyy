import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {HomeService} from "../../services/home.service";
import {SingerService} from "../../services/singer.service";
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";
import {first} from "rxjs/operators";

type HomeDataType = [Banner[],HotTag[],SongSheet[],Singer[]]

@Injectable({
  providedIn: 'root'
})

export class HomeResolver implements Resolve<HomeDataType> {

  constructor(
    private homeServe: HomeService,
    private singerServe: SingerService,
  ) {

  }

  resolve():Observable<HomeDataType> {
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalSheetList(),
      this.singerServe.getEnterSinger(),
    ]).pipe(first())
  }
}
