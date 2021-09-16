import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SongInfoComponent} from "./song-info.component";
import {SongInfoResolver} from "./song-info.resolver";

const routes: Routes = [
  {
    path: '',
    component: SongInfoComponent,
    data: {title: '歌曲详情'},
    resolve: {songInfo: SongInfoResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongInfoRoutingModule {
}
