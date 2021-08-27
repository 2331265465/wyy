import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Singer, SingerDetail} from "./data-types/common.types";
import qs from 'qs'

type SingerParams = {
  offset: number
  limit: number
  cat?: string
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001'
}

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {
  }

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({fromString: qs.stringify(args)})
    return this.http.get(this.uri + 'artist/list', {params})
      .pipe(map((res: { artists: Singer[] }) => res.artists))
  }

  //获取歌手详情和热门歌曲
  getSingerDetail(id: string): Observable<SingerDetail> {
    const params = new HttpParams().set('id', id)
    return this.http.get(this.uri + 'artists', {params})
      .pipe(map((res: SingerDetail) => res))
  }

  getSimiSinger(id: string): Observable<Singer[]> {
    const params = new HttpParams().set('id', id)
    return this.http.get(this.uri + 'simi/artist', {params})
      .pipe(map((res: { artists: Singer[] }) => res.artists))
  }
}
