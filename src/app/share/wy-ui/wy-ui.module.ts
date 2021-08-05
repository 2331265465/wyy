import {NgModule} from '@angular/core';
import {SingleSheetComponent} from './single-sheet/single-sheet.component';
import {PlayCountPipe} from "../play-count.pipe";
import {WyPlayerModule} from "./wy-player/wy-player.module";
import { WySliderTrackComponent } from './wy-slider/wy-slider-track.component';


@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  imports: [WyPlayerModule],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
  ]
})
export class WyUiModule {
}
