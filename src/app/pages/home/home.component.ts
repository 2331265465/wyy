import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Banner, HotTag, SongSheet} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  banner: Banner[]
  hotTags: HotTag[]
  songSheetList: SongSheet[]
  carouselActiveIndex: number
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent

  constructor(private homeServe: HomeService) {
  }

  ngOnInit(): void {
    this.getBanners()
    this.getHotTags()
    this.getPersonalizedSheetList()
  }

  private getBanners() {
    this.homeServe.getBanners().subscribe(banners => {
      this.banner = banners
    })
  }

  private getHotTags() {
    this.homeServe.getHotTags().subscribe(tags => {
      this.hotTags = tags
    })
  }

  private getPersonalizedSheetList() {
    this.homeServe.getPersonalSheetList().subscribe(sheets => {
      this.songSheetList = sheets
    })
  }

  onBeforeChange({to}) {
    this.carouselActiveIndex = to
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]()
  }


}
