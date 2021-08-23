import {Component, OnInit} from '@angular/core';
import {SheetParams, SheetService} from "../../services/sheet.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SheetList} from "../../services/data-types/common.types";
import {BatchActionsService} from "../../store/batch-actions.service";

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 1,
    limit: 35
  }
  sheets: SheetList
  orderValue = 'hot'

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private sheetServe: SheetService,
    private batchActionsServe: BatchActionsService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部'
  }

  ngOnInit(): void {
    this.getList()
  }

  getList() {
    this.sheetServe.getSheets(this.listParams).subscribe(sheet => {
      this.sheets = sheet
    })
  }

  onPlaySheet(id) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionsServe.selectPlayList({list, index: 0})
    })
  }

  onOrderChange(order: 'new' | 'hot') {
    this.listParams.order = order
    this.listParams.offset = 1
    this.getList()
  }

  onPageChange(page: number) {
    this.listParams.offset = page
    this.getList()
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo',id])
  }
}
