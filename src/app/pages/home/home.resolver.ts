import {Inject, Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {HomeService} from "../../services/home.service";
import {SingerService} from "../../services/singer.service";
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";
import {first, take} from "rxjs/operators";
import {MemberService} from "../../services/member.service";
import {WINDOW} from "../../services/services.module";
import {User} from "../../services/data-types/member";

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
