import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SheetInfoComponent} from "./sheet-info.component";
import {SheetInfoResolver} from "./sheet-info.resolver";

const routes: Routes = [
  {
    path: '',
    component: SheetInfoComponent,
    data: {title: '歌单详情'},
    resolve: {sheetInfo: SheetInfoResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetInfoRoutingModule {
}
