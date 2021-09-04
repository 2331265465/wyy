import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {first} from "rxjs/operators";
import {RecordVal, User, UserSheet} from "../../../services/data-types/member.type";
import {MemberService} from "../../../services/member.service";

type CenterDataType = [User,RecordVal[],UserSheet]

@Injectable({
  providedIn: 'root'
})

export class CenterResolver implements Resolve<CenterDataType> {

  constructor(
    private memberServe:MemberService,
    private router:Router
  ) {

  }

  resolve(route:ActivatedRouteSnapshot):Observable<CenterDataType> {
    const uid = route.paramMap.get('uid')
    if (uid) {
      return forkJoin([
        this.memberServe.getUserDetail(uid),
        this.memberServe.getUserRecord(uid),
        this.memberServe.getUserSheets(uid),
      ]).pipe(first())
    }else {
      this.router.navigateByUrl('/home')
    }

  }
}
