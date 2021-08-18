import {Injectable} from '@angular/core';
import {AppStoreModule} from "./store.module";
import {Song} from "../services/data-types/common.types";
import {SetCurrentIndex, SetPlayList, SetSongList} from "./actions/player.actions";
import {findIndex, shuffle} from "../utils/array";
import {select, Store} from "@ngrx/store";
import {selectPlayer} from "./selectors/player.selector";
import {PlayState} from "./reducers/player.reducer";

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  playerState: PlayState
  constructor(private store$: Store<AppStoreModule>) {
    this.store$.pipe(select(selectPlayer)).subscribe(res => this.playerState = res)
  }

  //播放列表
  selectPlayList({list, index}:{ list: Song[], index: number }) {
    this.store$.dispatch(SetSongList({songList: list}))
    let trueIndex = index
    let trueList = list.slice()
    if (this.playerState.playMode.type === 'random') {
      trueList = shuffle(list || [])
      trueIndex = findIndex(trueList, list[trueIndex])
    }
    this.store$.dispatch(SetPlayList({playList: trueList}))
    this.store$.dispatch(SetCurrentIndex({currentIndex: trueIndex}))
  }

  deleteSong(song:Song) {
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
  }

  clearSong() {
    this.store$.dispatch(SetSongList({songList: []}))
    this.store$.dispatch(SetPlayList({playList: []}))
    this.store$.dispatch(SetCurrentIndex({currentIndex: -1}))
  }
}
