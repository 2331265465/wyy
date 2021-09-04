import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Singer, SongSheet} from "../../services/data-types/common.types";
import {NzCarouselComponent} from "ng-zorro-antd/carousel";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {SheetService} from "../../services/sheet.service";
import {BatchActionsService} from "../../store/batch-actions.service";
import {ModalTypes} from "../../store/reducers/member.reducer";
import {User} from "../../services/data-types/member.type";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../store/store.module";
import {getUserId, selectMember} from "../../store/selectors/member.selector";
import {MemberService} from "../../services/member.service";

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
  user: User
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetServe: SheetService,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private store$: Store<AppStoreModule>
  ) {
  }

  ngOnInit(): void {
    this.route.data.pipe(map(res => res.homeData)).subscribe(([banners, hotTags, sheets, singer]) => {
      this.banner = banners
      this.hotTags = hotTags
      this.songSheetList = sheets
      this.singers = singer
    })
    this.store$.pipe(select(selectMember), select(getUserId)).subscribe(id => {
      if (id) {
        this.getUserDetail(id)
      }else {
        this.user = null
      }
    })
  }

  private getUserDetail(id: string) {
    this.memberServe.getUserDetail(id).subscribe(user => this.user = user)
  }

  onBeforeChange({to}) {
    this.carouselActiveIndex = to
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]()
  }

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionsServe.selectPlayList({list, index: 0})
    })
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id])
  }

  openModal() {
    this.batchActionsServe.controlModal(true, ModalTypes.Default)
  }
}
