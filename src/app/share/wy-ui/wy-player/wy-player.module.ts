import {NgModule} from '@angular/core';
import {WyPlayerComponent} from './wy-player.component';
import {WySliderModule} from "../wy-slider/wy-slider.module";
import {FormsModule} from '@angular/forms'
import {CommonModule} from "@angular/common";
import {FormatTimePipe} from "../../pipes/format-time.pipe";
import {WyPlayerPanelComponent} from './wy-player-panel/wy-player-panel.component';
import {WyScrollComponent} from "./wy-scroll/wy-scroll.component";
import {ClickoutsideDirective} from "../../directives/clickoutside.directive";


@NgModule({
  declarations: [
    WyPlayerComponent,
    FormatTimePipe,
    WyPlayerPanelComponent,
    WyScrollComponent,
    ClickoutsideDirective
  ],
  imports: [
    WySliderModule,
    FormsModule,
    CommonModule,
  ],
  exports: [WyPlayerComponent, FormatTimePipe, ClickoutsideDirective],
})
export class WyPlayerModule {
}
