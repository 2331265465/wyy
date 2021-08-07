import {PlayMode} from "../../share/wy-ui/wy-player/player-type";
import {Song} from "../../services/data-types/common.types";
import {Action, createReducer, on} from "@ngrx/store";
import {SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList} from "../actions/player.actions";

export type PlayState = {
  playing: boolean //播放状态
  playMode: PlayMode //播放模式
  songList: Song[] //歌曲列表
  playList: Song[] //播放列表
  currentIndex: number //正在播放的索引
}

export const initialState: PlayState = {
  playing: false,
  songList: [],
  playList: [],
  playMode: {type: 'loop', label: '循环'},
  currentIndex: -1
}

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, {playing}) => ({...state, playing})),
  on(SetPlayList, (state, {playList}) => ({...state, playList})),
  on(SetSongList, (state, {songList}) => ({...state, songList})),
  on(SetPlayMode, (state, {playMode}) => ({...state, playMode})),
  on(SetCurrentIndex, (state, {currentIndex}) => ({...state, currentIndex})),
)
export function playerReducer(state:PlayState,action:Action) {
  return reducer(state,action)
}

