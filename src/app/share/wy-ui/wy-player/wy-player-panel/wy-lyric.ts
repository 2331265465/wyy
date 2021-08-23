import {Lyric} from "../../../../services/data-types/common.types";
import {from, Subject, Subscription, timer, zip} from "rxjs";
import {skip} from "rxjs/operators";

//[00:00.000] [00:00.00] [00:00]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})?]/

export interface BaseLyricLine {
  txt: string
  txtCn?: string
}

export interface LyricLine extends BaseLyricLine {
  time?: number
}

interface Handler extends BaseLyricLine {
  lineNum: number
}

export class WyLyric{
  private lrc: Lyric
  lines: LyricLine[] = []
  playing = false
  curNum: number
  startStamp: number
  handler = new Subject<Handler>()
  timer$:Subscription
  pauseStamp:number
  constructor(lrc: Lyric) {
    this.lrc = lrc
    this.init()
  }

  private init() {
    if (this.lrc.nolyric) {
      this.noLyric()
    } else {
      if (this.lrc.tlyric) {
        this.generTLyric()
      } else {
        this.generLyric()
      }
    }
  }

  private generLyric() {
    const lines = this.lrc.lyric.split('\n')
    lines.forEach(line => this.makeLine(line))
  }

  private generTLyric() {
    const lines = this.lrc.lyric.split('\n')
    const tLines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null)
    const moreLine = lines.length - tLines.length
    let tempArr = []
    if (moreLine >= 0) {
      tempArr = [lines, tLines]
    } else {
      tempArr = [tLines, lines]
    }

    const first = timeExp.exec(tempArr[1][0])[0]
    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item)
      if (exec) {
        return exec[0] === first
      }
    })
    const _skip = skipIndex === -1 ? 0 : skipIndex
    const skipItems = tempArr[0].slice(0, _skip)
    if (skipItems.length) {
      skipItems.forEach(line => this.makeLine(line))
    }
    let zipLines$;
    if (moreLine > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tLines))
    } else {
      zipLines$ = zip(from(lines), from(tLines).pipe(skip(_skip)))
    }
    zipLines$.subscribe(([lines, tLines]) => {
      this.makeLine(lines, tLines)
    })
  }

  private noLyric() {
    this.lines.push({txt: this.lrc.lyric})
  }



  private makeLine(line: string, tLine = '') {
    const result = timeExp.exec(line)
    if (result) {
      const txt = line.replace(timeExp, '').trim()
      const txtCn = tLine ? tLine.replace(timeExp, '').trim() : ''
      if (txt) {
        const thirdResult = result[3] || '00'
        const len = thirdResult.length
        const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
        this.lines.push({txt, txtCn, time})
      }
    }
  }

  play(startTime = 0,skip = false) {
    if (!this.lines.length) return;
    if (!this.playing) {
      this.playing = true
    }
    this.curNum = this.findCurNum(startTime)
    this.startStamp = Date.now() - startTime
    if (!skip) {
      this.callHandler(this.curNum - 1)
    }
    if (this.curNum < this.lines.length) {
      this.playReset()
    }
  }

  findCurNum(time: number): number {
    const index = this.lines.findIndex(item => time <= item.time)
    return index === -1 ? this.lines.length - 1 : index
  }

  callHandler(i: number) {
    if (i > 0) {
      this.handler.next({
        txt:this.lines[i].txt,
        txtCn:this.lines[i].txtCn,
        lineNum:i
      })
    }
  }

  playReset() {
    let line = this.lines[this.curNum]
    const delay = line.time - (Date.now() - this.startStamp)
    this.timer$ = timer(delay).subscribe(() => {
      this.callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.playing) {
        this.clearTimer()
        this.playReset()
      }
    })
  }

  togglePlay(playing: boolean) {
    const now = Date.now()
    this.playing = playing
    if (playing) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now)
      this.play(startTime,true)
    } else {
      this.stop()
      this.pauseStamp = now
    }
  }

  clearTimer() {
    this.timer$ && this.timer$.unsubscribe()
    this.timer$ = null
  }

  stop() {
    if (this.playing) {
      this.playing = false
    }
    this.clearTimer()
  }

  seek(time:number) {
    this.play(time)
  }
}
