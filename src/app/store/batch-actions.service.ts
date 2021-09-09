import {Injectable} from '@angular/core';
import {AppStoreModule} from "./store.module";
import {Song} from "../services/data-types/common.types";
import {SetCurrentAction, SetCurrentIndex, SetPlayList, SetSongList} from "./actions/player.actions";
import {findIndex, shuffle} from "../utils/array";
import {select, Store} from "@ngrx/store";
import {selectPlayer} from "./selectors/player.selector";
import {CurrentActions, PlayState} from "./reducers/player.reducer";
import {selectMember} from "./selectors/member.selector";
import {MemberState, ModalTypes} from "./reducers/member.reducer";
import {SetLikeId, SetModalType, SetModalVisible} from "./actions/member.actions";

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  playerState: PlayState
  memberState: MemberState

  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select(selectPlayer)).subscribe(res => this.playerState = res)
    this.store$.pipe(select(selectMember)).subscribe(res => this.memberState = res)
  }

  //播放列表
  selectPlayList({list, index}: { list: Song[], index: number }) {
    this.store$.dispatch(SetSongList({songList: list}))
    let trueIndex = index
    let trueList = list.slice()
    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(list || [])
      trueIndex = findIndex(trueList, list[trueIndex])
    }
    this.store$.dispatch(SetPlayList({playList: trueList}))
    this.store$.dispatch(SetCurrentIndex({currentIndex: trueIndex}))
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Play}))
  }

  //删除歌曲
  deleteSong(song: Song) {
    const songList = this.playerState.songList.slice()
    const playList = this.playerState.playList.slice()
    let currentIndex = this.playerState.currentIndex
    const songIndex = findIndex(songList, song)
    songList.splice(songIndex, 1)
    const playIndex = findIndex(playList, song)
    playList.splice(playIndex, 1)

    if (currentIndex > playIndex || currentIndex === playList.length) {
      currentIndex--
    }

    this.store$.dispatch(SetSongList({songList}))
    this.store$.dispatch(SetPlayList({playList}))
    this.store$.dispatch(SetCurrentIndex({currentIndex}))
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Delete}))

  }

  //添加歌曲
  insertSong(song: Song, isPlay) {
    const songList = this.playerState.songList.slice()
    const playList = this.playerState.playList.slice()
    let insertIndex = this.playerState.currentIndex
    const playIndex = findIndex(playList, song)
    if (playIndex > -1) {
      if (isPlay) {
        insertIndex = playIndex
      }
    } else {
      songList.push(song)
      playList.push(song)
      if (isPlay) {
        insertIndex = songList.length - 1
      }
      this.store$.dispatch(SetSongList({songList}))
      this.store$.dispatch(SetPlayList({playList}))
    }

    if (insertIndex !== this.playerState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({currentIndex: insertIndex}))
      this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Play}))
    } else {
      this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Add}))
    }
  }

  //添加多首歌曲
  insertSongs(songs: Song[]) {
    const songList = this.playerState.songList.slice()
    const playList = this.playerState.playList.slice()
    songs.forEach(item => {
      const pIndex = findIndex(playList, item)
      if (pIndex === -1) {
        songList.push(item)
        playList.push(item)
      }
    })
    this.store$.dispatch(SetSongList({songList}))
    this.store$.dispatch(SetPlayList({playList}))
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Add}))

  }

  //清空歌曲
  clearSong() {
    this.store$.dispatch(SetSongList({songList: []}))
    this.store$.dispatch(SetPlayList({playList: []}))
    this.store$.dispatch(SetCurrentIndex({currentIndex: -1}))
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Clear}))
  }

  //会员弹窗显示隐藏/类型
  controlModal(modalVisible = true,modalType = ModalTypes.Default) {
    if (modalType) {
      this.store$.dispatch(SetModalType({modalType}))
    }
    this.store$.dispatch(SetModalVisible({modalVisible}))
  }

  //收藏歌曲
  likeSong(id:string) {
    this.store$.dispatch(SetModalType({modalType:ModalTypes.Like}))
    this.store$.dispatch(SetLikeId({id}))
  }
}
