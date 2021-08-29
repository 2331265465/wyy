import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from "./services.module";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {SearchResult} from "./data-types/common.types";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: ServicesModule
})
export class SearchService {

  constructor(private http:HttpClient,@Inject(API_CONFIG) private uri:string) { }

  search(keyword:string):Observable<SearchResult> {
    const params = new HttpParams().set('keywords',keyword)
    return this.http.get(this.uri + 'search/suggest',{params})
      .pipe(map((res:{result:SearchResult}) => res.result))
  }


}
