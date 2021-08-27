import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {Lyric, Song} from "../../services/data-types/common.types";
import {SongService} from "../../services/song.service";
import {first} from "rxjs/operators";

type SongDataModel = [Song, Lyric]

@Injectable({
  providedIn: 'root'
})
export class SongInfoResolver implements Resolve<SongDataModel> {
  constructor(private songServe:SongService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
    const id = route.paramMap.get('id')
    return forkJoin([
      this.songServe.getSongDetail(id),
      this.songServe.getLyric(Number(id))
    ]).pipe(first())
  }
}
