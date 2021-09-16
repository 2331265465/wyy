import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {SearchService} from "./services/search.service";
import {SearchResult, SongSheet} from "./services/data-types/common.types";
import {isObject} from "./utils/tools";
import {ModalTypes, ShareInfo} from "./store/reducers/member.reducer";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "./store/store.module";
import {SetModalType, SetModalVisible, SetUserId} from "./store/actions/member.actions";
import {BatchActionsService} from "./store/batch-actions.service";
import {LoginParams} from "./share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component";
import {LikeSongPid, MemberService, ShareParams} from "./services/member.service";
import {User} from "./services/data-types/member.type";
import {NzMessageService} from "ng-zorro-antd/message";
import {codeJson} from "./utils/base64";
import {getLikeId, getModalType, getModalVisible, getShareInfo, selectMember} from "./store/selectors/member.selector";
import {
  ActivatedRoute,
  ActivationEnd, ActivationStart,
  ChildActivationEnd,
  ChildActivationStart,
  NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart,
  Router, RouterEvent, Scroll
} from "@angular/router";
import {filter, map, mergeMap, takeUntil} from "rxjs/operators";
import {interval, Observable} from "rxjs";
import {Title} from "@angular/platform-browser";
import {isPlatformBrowser} from "@angular/common";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  title = 'ng-wyy';
  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    },
  ]
  searchResult: SearchResult
  user: User
  wyRememberLogin: LoginParams
  mySheets: SongSheet[]
  likeId: string; // 被收藏歌曲的id
  visible = false //弹窗提示
  showSpin = false //显示loading
  currentModalType = ModalTypes.Default //弹窗类型
  shareInfo: ShareInfo //分享信息
  private navEnd: Observable<RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll>;
  routeTitle = ''
  loadPercent = 0
  private readonly isBrowser: boolean

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private searchServe: SearchService,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private store$: Store<AppStoreModule>,
    private messageServe: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private titleServe: Title,
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
    let userId = null
    if (this.isBrowser) {
      userId = localStorage.getItem('wyUserId')
    }
    if (userId) {
      this.store$.dispatch(SetUserId({id: userId}))
      this.memberServe.getUserDetail(userId).subscribe(user => this.user = user)
    }
    let wyRememberLogin = null
    if (this.isBrowser) {
      wyRememberLogin = localStorage.getItem('wyRememberLogin')
    }
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin)
    }
    this.listenStates()

    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(() => {
      this.loadPercent = 0
      this.setTitle()
    })

    this.navEnd = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
    this.setLoadingBar()
  }

  private setLoadingBar() {
    interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
      this.loadPercent = Math.max(95, ++this.loadPercent)
    })
    this.navEnd.subscribe(() => this.loadPercent = 100)
  }

  private setTitle() {
    this.navEnd.pipe(
      map(() => this.route),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.routeTitle = data['title']
      this.titleServe.setTitle(this.routeTitle)
    })
  }

  listenStates() {
    const appStore$ = this.store$.select(selectMember)
    const stateArr = [
      {
        type: getLikeId,
        callback: id => this.watchLikeId(id)
      },
      {
        type: getModalVisible,
        callback: visible => this.watchModalVisible(visible)
      },
      {
        type: getModalType,
        callback: type => this.watchModalType(type)
      },
      {
        type: getShareInfo,
        callback: info => this.watchShareInfo(info)
      },
    ]
    stateArr.forEach((item: { type: any, callback: () => void }) => {
      appStore$.pipe(select(item.type)).subscribe(item.callback)
    })
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id
    }
  }

  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      this.currentModalType = type
      if (type === ModalTypes.Like) {
        this.onLoadMySheets()
      }
    }
  }

  private watchModalVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible
    }
  }

  private watchShareInfo(info: ShareInfo) {
    if (info) {
      if (this.user) {
        this.shareInfo = info
        this.openModal(ModalTypes.Share)
      } else {
        this.openModal(ModalTypes.Default)
      }
    }
  }

  search(keyword: string) {
    if (keyword) {
      this.searchServe.search(keyword).subscribe(res => {
        this.searchResult = this.highlightKeyword(keyword, res)
      })
    } else {
      this.searchResult = {}
    }
  }

  private highlightKeyword(keyword: string, result: SearchResult): SearchResult {
    if (!isObject(result)) {
      const reg = new RegExp(keyword, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>')
          })
        }
      })
    }
    return result
  }

  changeModalType(modalType = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({modalType}))
  }

  //打开弹窗
  openModal(type: string) {
    switch (type.toLowerCase()) {
      case 'loginByPhone':
        this.batchActionsServe.controlModal(true, ModalTypes.LoginByPhone)
        break
      case 'register':
        this.batchActionsServe.controlModal(true, ModalTypes.Register)
        break
      case 'like':
        this.batchActionsServe.controlModal(true, ModalTypes.Like)
        break
      case 'share':
        this.batchActionsServe.controlModal(true, ModalTypes.Share)
        break
      default:
        this.batchActionsServe.controlModal(true, ModalTypes.Default)
        break
    }
  }

  closeModal() {
    this.batchActionsServe.controlModal(false)
  }

  login(params: LoginParams) {
    this.showSpin = true
    this.memberServe.login(params).subscribe(user => {
      if(user.code !== 200) {
        this.showSpin = false
        this.messageServe.create('error', user['msg'] || '登陆失败')
        return
      }
      this.user = user
      this.closeModal()
      this.alertMessage('success', '登陆成功')
      const userId = this.user.profile.userId
      if (this.isBrowser) {
        localStorage.setItem('wyUserId', userId.toString())
        if (params.remember) {
          localStorage.setItem('wyRememberLogin', JSON.stringify(codeJson(params)))
        } else {
          localStorage.removeItem('wyRememberLogin')
        }
      }
      this.store$.dispatch(SetUserId({id: userId.toString()}))
      this.showSpin = false
    })
  }

  private alertMessage(type: string, message: string) {
    this.messageServe.create(type, message)
  }

  logout() {
    this.memberServe.logout().subscribe(() => {
      this.user = null
      this.alertMessage('success', '退出成功')
      if (this.isBrowser) {
        localStorage.removeItem('wyUserId')
      }
      this.store$.dispatch(SetUserId({id: ''}))
    }, error => {
      this.alertMessage('error', error.message || '退出失败')
    })
  }

  //获取当前用户的歌单
  onLoadMySheets() {
    if (this.user) {
      this.memberServe.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
        this.mySheets = userSheet.self
        this.store$.dispatch(SetModalVisible({modalVisible: true}))
      })
    } else {
      this.openModal(ModalTypes.Default)
    }
  }

  //收藏歌曲
  onLikeSong(args: LikeSongPid) {
    this.memberServe.likeSong(args).subscribe(() => {
      this.closeModal()
      this.alertMessage('success', '收藏成功')
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败')
    })
  }

  onCreateSheet(sheet: string) {
    this.memberServe.createSheet(sheet).subscribe(pid => {
      this.onLikeSong({pid, tracks: this.likeId})
    }, error => {
      this.alertMessage('error', error.msg || '新建失败')
    })
  }

  //分享
  onShare(arg: ShareParams) {
    this.memberServe.shareResource(arg).subscribe(() => {
      this.alertMessage('success', '分享成功')
      this.closeModal()
    }, error => {
      this.alertMessage('error', error.msg || '分享失败')
    })
  }

  onRegister() {
    this.alertMessage('success', '注册成功')
  }
}
