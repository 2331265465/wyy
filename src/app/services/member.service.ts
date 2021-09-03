import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {API_CONFIG} from "./services.module";
import {User} from "./data-types/member";
import qs from 'qs'
import {LoginParams} from "../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component";
import {SampleBack, SignIn} from "./data-types/common.types";

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) {
  }
  //登陆
  login(formValue: LoginParams): Observable<User> {
    const params = new HttpParams({fromString: qs.stringify(formValue)})
    return this.http.get(this.uri + 'login/cellphone', {params})
      .pipe(map((res:User) => res))
  }

  //退出登陆
  logout(): Observable<SampleBack> {
    return this.http.get(this.uri + 'logout')
      .pipe(map((res:SampleBack) => res))
  }

  //用户详情
  getUserDetail(uid:string): Observable<User> {
    const params = new HttpParams().set('uid',uid)
    return this.http.get(this.uri + 'user/detail', {params})
      .pipe(map((res:User) => res))
  }

  //签到
  signIn():Observable<SignIn> {
    const params = new HttpParams({fromString:qs.stringify({type: 1})})
    return this.http.get(this.uri + 'daily_signin',{params})
      .pipe(map((res:SignIn) => res))
  }
}
