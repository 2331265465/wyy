import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_CONFIG, ServicesModule} from "./services.module";
import {Observable} from "rxjs";
import {SheetList, Song, SongSheet} from "./data-types/common.types";
import {map, pluck, switchMap} from "rxjs/operators";
import {SongService} from "./song.service";
import qs from 'qs'
export type SheetParams = {
  offset:number
  limit:number
  order: 'new' | 'hot'
  cat:string
}

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string,
    private songServe:SongService
  ) {
  }

  //获取歌单列表
  getSheets(args:SheetParams):Observable<SheetList> {
    const params = new HttpParams({fromString:qs.stringify(args)})
    return this.http.get(this.uri + 'top/playlist',{params})
      .pipe(map((res:SheetList) => res))
  }

  //获取歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString())
    return this.http.get(this.uri + 'playlist/detail', {params})
      .pipe(map((res: { playlist: SongSheet }) => res.playlist))
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
      .pipe(pluck('tracks'), switchMap((tracks:Song | Song[]) => this.songServe.getSongList(tracks)))
  }

}
