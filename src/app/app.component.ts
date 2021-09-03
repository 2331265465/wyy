import {Component, Inject} from '@angular/core';
import {SearchService} from "./services/search.service";
import {SearchResult} from "./services/data-types/common.types";
import {isObject} from "./utils/tools";
import {ModalTypes} from "./store/reducers/member.reducer";
import {Store} from "@ngrx/store";
import {AppStoreModule} from "./store/store.module";
import {SetModalType, SetUserId} from "./store/actions/member.actions";
import {BatchActionsService} from "./store/batch-actions.service";
import {LoginParams} from "./share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component";
import {MemberService} from "./services/member.service";
import {User} from "./services/data-types/member";
import {NzMessageService} from "ng-zorro-antd/message";
import {WINDOW} from "./services/services.module";
import {codeJson} from "./utils/base64";

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
  user:User
  wyRememberLogin:LoginParams
  constructor(
    @Inject(WINDOW) private win:Window,
    private searchServe: SearchService,
    private batchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private store$: Store<AppStoreModule>,
    private messageServe:NzMessageService,
  ) {
    const userId = this.win.localStorage.getItem('wyUserId')
    if (userId) {
      this.store$.dispatch(SetUserId({id:userId}))
      this.memberServe.getUserDetail(userId).subscribe(user => this.user = user)
    }
    const wyRememberLogin = this.win.localStorage.getItem('wyRememberLogin')
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin)
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
  openModal(type: 'loginByPhone' | 'register') {
    type === 'register' ?
      this.batchActionsServe.controlModal(true, ModalTypes.Register) :
      this.batchActionsServe.controlModal(true, ModalTypes.LoginByPhone);
  }

  login(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      if (user.code !== 200) return;
      this.user = user
      this.batchActionsServe.controlModal(false)
      this.alertMessage('success','登陆成功')
      const userId = this.user.profile.userId
      this.win.localStorage.setItem('wyUserId',userId.toString())
      if (params.remember) {
        this.win.localStorage.setItem('wyRememberLogin',JSON.stringify(codeJson(params)))
      }else {
        this.win.localStorage.removeItem('wyRememberLogin')
      }
      this.store$.dispatch(SetUserId({id:userId.toString()}))
    }, error => {
      this.messageServe.create('error',error.message || '登陆失败')
    })
  }

  private alertMessage(type:string,message:string) {
    this.messageServe.create(type,message)
  }

  logout() {
    this.memberServe.logout().subscribe(() => {
      this.user = null
      this.alertMessage('success','退出成功')
      this.win.localStorage.removeItem('wyUserId')
      this.store$.dispatch(SetUserId({id:''}))
    },error => {
      this.alertMessage('error',error.message || '退出失败')
    })
  }
}
