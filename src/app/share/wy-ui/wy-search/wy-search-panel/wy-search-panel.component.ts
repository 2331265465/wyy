import { Component, OnInit } from '@angular/core';
import {SearchResult} from "../../../../services/data-types/common.types";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  searchResult:SearchResult
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  toInfo(path: [string,number]) {
    if (path[0]) {
      this.router.navigate([path[0],path[1]])
    }
  }
}
