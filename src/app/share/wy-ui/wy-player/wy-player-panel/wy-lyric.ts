import {Lyric} from "../../../../services/data-types/common.types";
import {from, zip} from "rxjs";
import {skip} from "rxjs/operators";

const timeExp = /\[(\d{2}):(\d{2}).(\d{2,3})]/

export interface BaseLyricLine {
  txt: string
  txtCn?: string
}

interface LyricLine extends BaseLyricLine {
  time?: number
}

export class WyLyric {
  private lrc: Lyric
  lines: LyricLine[] = []

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
    const skipItems = tempArr[0].slice(0,_skip)
    if (skipItems.length) {
      skipItems.forEach(line => this.makeLine(line))
    }
    let zipLines$;
    if (moreLine > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)),from(tLines))
    }else {
      zipLines$ = zip(from(lines),from(tLines).pipe(skip(_skip)))
    }
    zipLines$.subscribe(([lines,tLines]) => {
      this.makeLine(lines,tLines)
    })
  }

  private noLyric() {
    this.lines.push({txt:this.lrc.lyric})
  }

  private makeLine(line: string,tLine = '') {
    const result = timeExp.exec(line)
    if (result) {
      const txt = line.replace(timeExp, '').trim()
      const txtCn = tLine ? tLine.replace(timeExp,'').trim() : ''
      if (txt) {
        const thirdResult = result[3] || '00'
        const len = thirdResult.length
        const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
        this.lines.push({txt, txtCn, time})
      }
    }
  }
}
