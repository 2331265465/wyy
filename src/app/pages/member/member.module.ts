import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { CenterComponent } from './center/center.component';
import {WyUiModule} from "../../share/wy-ui/wy-ui.module";
import { RecordsComponent } from './center/components/records/records.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzTableModule} from "ng-zorro-antd/table";


@NgModule({
  declarations: [CenterComponent, RecordsComponent],
  imports: [
    CommonModule,
    MemberRoutingModule,
    WyUiModule,
    NzDividerModule,
    NzTableModule,
  ]
})
export class MemberModule { }
