import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CenterComponent} from "./center/center.component";
import {CenterResolver} from "./center/center.resolver";

const routes: Routes = [
  {
    path:'member/:uid',
    component:CenterComponent,
    data:{title:'个人中心'},
    resolve:{user:CenterResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
