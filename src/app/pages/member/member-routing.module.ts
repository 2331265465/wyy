import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CenterComponent} from "./center/center.component";
import {CenterResolver} from "./center/center.resolver";
import {RecordDetailComponent} from "./record-detail/record-detail.component";
import {RecordResolver} from "./record-detail/record.resolver";

const routes: Routes = [
  {
    path:'',
    component:CenterComponent,
    data:{title:'个人中心'},
    resolve:{user:CenterResolver}
  },
  {
    path:'records/:uid',
    component:RecordDetailComponent,
    data:{title:'听歌记录'},
    resolve:{user:RecordResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[CenterResolver,RecordResolver]
})
export class MemberRoutingModule { }
