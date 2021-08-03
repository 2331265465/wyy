import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";
import {SingerService} from "../../services/singer.service";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";

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
    private route:ActivatedRoute
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

}
