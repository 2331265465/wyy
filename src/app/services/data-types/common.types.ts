//轮播图
export type Banner = {
  targetId: number
  url: string
  imageUrl: string
}

//标签
export type HotTag = {
  id: number
  name: string
  position: number
}

//歌单
export type SongSheet = {
  id: number
  name: string
  playCount: number
  coverImgUrl: string
  picUrl: string
  tags: string[]
  createTime: number
  creator: { nickname: string; avatarUrl: string }
  description: string
  subscribedCount: number
  shareCount: number
  commentCount: number
  subscribed: boolean
  userId:number
  tracks: Song[]
}

//播放地址
export type SongUrl = {
  id: number
  url: string
}

//歌曲
export type Song = {
  id: number
  name: string
  url: string
  ar: Singer[]
  al: {
    id: number
    name: string
    picUrl: string
  }
  dt: number
}

//歌手
export type Singer = {
  id: number
  name: string
  picUrl: string
  albumSize: number
  tracks: Song
}

export type Lyric = {
  lyric: string
  tlyric?: string
  nolyric: boolean
}

export type SheetList = {
  playlists: SongSheet[]
  total: number
}
