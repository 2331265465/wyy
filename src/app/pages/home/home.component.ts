import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Banner} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  banner: Banner[]
  carouselActiveIndex: number
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent
  constructor(private homeServe: HomeService) {
  }

  ngOnInit(): void {
    this.homeServe.getBanners().subscribe(banners => {
      this.banner = banners
    })
  }

  OnBeforeChange({to}) {
    this.carouselActiveIndex = to
  }

  onChangeSlide(type:'pre'|'next') {
    this.nzCarousel[type]()
  }
}
