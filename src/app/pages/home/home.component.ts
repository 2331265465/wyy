import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";
import {SheetService} from "../../services/sheet.service";
import {Store} from "@ngrx/store";
import {AppStoreModule} from "../../store/store.module";
import {SetCurrentIndex, SetPlayList, SetSongList} from "../../store/actions/player.actions";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  banner: Banner[]
  hotTags: HotTag[]
  songSheetList: SongSheet[]
  singers: Singer[]
  carouselActiveIndex: number
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent

  constructor(
    private route:ActivatedRoute,
    private sheetServe:SheetService,
    private store$:Store<AppStoreModule>
  ) {
  }

  ngOnInit(): void {
    this.route.data.pipe(map(res => res.homeData)).subscribe(([banners, hotTags, sheets, singer]) => {
      this.banner = banners
      this.hotTags = hotTags
      this.songSheetList = sheets
      this.singers = singer
    })
  }

  onBeforeChange({to}) {
    this.carouselActiveIndex = to
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]()
  }

  onPlaySheet(id:number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({songList:list}))
      this.store$.dispatch(SetPlayList({playList:list}))
      this.store$.dispatch(SetCurrentIndex({currentIndex:0}))
    })
  }

}
