import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SingerDetailComponent} from "./singer-detail/singer-detail.component";
import {SingerResolver} from "./singer-detail/singer.resolver";

const routes: Routes = [
  {
    path: 'singer/:id',
    component: SingerDetailComponent,
    data: {title: '歌手详情'},
    resolve: {singerDetail: SingerResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingerRoutingModule {
}
