import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, takeUntil} from "rxjs/operators";
import {Singer, Song, SongSheet} from "../../services/data-types/common.types";
import {select, Store} from "@ngrx/store";
import {AppStoreModule} from "../../store/store.module";
import {Subject} from "rxjs";
import {getCurrentSong, selectPlayer} from "../../store/selectors/player.selector";
import {SongService} from "../../services/song.service";
import {BatchActionsService} from "../../store/batch-actions.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {findIndex} from "../../utils/array";
import {MemberService} from "../../services/member.service";
import {SetShareInfo} from "../../store/actions/member.actions";

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  sheetInfo: SongSheet
  description = {
    short: '',
    long: ''
  }
  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  }

  private destroy$ = new Subject<void>()
  private currentSong: Song
  currentIndex = -1
  subscribed = false

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService,
    private memberServe: MemberService,
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res
      this.subscribed = res.subscribed
      if (res.description) {
        this.changeDesc(res.description)
      }
      this.listenCurrent()
    })
  }

  ngOnInit(): void {
  }

  private replaceBr(str: string): string {
    return str.replace(/\n/g, '<br/>')
  }

  private changeDesc(desc: string) {
    if (desc.length < 99) {
      this.description = {
        short: this.replaceBr(`<p>介绍:</p> ${desc}`),
        long: ''
      }
    } else {
      this.description = {
        short: this.replaceBr(`<p>介绍:</p>${desc.slice(0, 99)}...`),
        long: this.replaceBr(`<p>介绍:</p>${desc}`),
      }
    }
  }

  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起'
      this.controlDesc.iconCls = 'up'
    } else {
      this.controlDesc.label = '展开'
      this.controlDesc.iconCls = 'down'
    }
  }

  //添加一首歌曲
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay)
        } else {
          this.messageServe.warning('当前歌曲无音频可播放', {
            nzDuration: 1500,
          })
        }
      })
    }
  }

  private listenCurrent() {
    this.store$.pipe(select(selectPlayer), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe(song => {
        this.currentSong = song
        if (song) {
          this.currentIndex = findIndex(this.sheetInfo.tracks, song)
        } else {
          this.currentIndex = -1
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({list, index: 0})
        } else {
          this.batchActionServe.insertSongs(list)
        }
      }
    })
  }

  //收藏歌曲
  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id)
  }

  onLikeSheet(id: string, t?: 1 | 2) {
    this.subscribed ? t = 2 : t = 1;
    this.memberServe.likeSheet(id, t).subscribe(() => {
      if (this.subscribed) {
        this.messageServe.success('取消收藏成功')
        this.subscribed = false
      } else {
        this.messageServe.success('收藏成功')
        this.subscribed = true
      }
    }, error => {
      this.messageServe.error(error.msg || (this.sheetInfo.subscribed ? '取消收藏失败' : '收藏失败'))
    })
  }

  //分享
  shareResource(resource: Song | SongSheet, type = 'song') {
    let txt = ''
    if (type === 'playlist') {
      txt = this.makeTxt('歌单',resource.name,(<SongSheet>resource).creator.nickname)
    } else {
      txt = this.makeTxt('歌曲',resource.name,(<Song>resource).ar)
    }
    this.store$.dispatch(SetShareInfo({info: {id: resource.id.toString(), type, txt} }))
  }

  makeTxt(type: string, name: string, makeBy: string | Singer[]): string {
    let makeByStr = ''
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join('/')
    }else {
      makeByStr = makeBy
    }
    return `${type}:${name} -- ${makeByStr}`
  }

}
