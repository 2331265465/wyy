import {Component} from '@angular/core';
import {SearchService} from "./services/search.service";
import {SearchResult} from "./services/data-types/common.types";
import {isObject} from "./utils/tools";

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
  searchResult:SearchResult

  constructor(private searchServe:SearchService) {
  }

  search(keyword: string) {
    if (keyword) {
      this.searchServe.search(keyword).subscribe(res => {
        this.searchResult = this.highlightKeyword(keyword,res)
      })
    }else {
      this.searchResult = {}
    }
  }

  private highlightKeyword(keyword:string,result:SearchResult):SearchResult {
    if (!isObject(result)) {
      const reg = new RegExp(keyword,'ig');
      ['artists','playlists','songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg,'<span class="highlight">$&</span>')
          })
        }
      })
    }
    return result
  }
}
