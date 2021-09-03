import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../../services/data-types/member";
import {MemberService} from "../../../../services/member.service";
import {timer} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {

  point:number
  showPoint = false

  @Output() openModal = new EventEmitter<void>()
  @Input() user:User
  constructor(private memberServe:MemberService,private messageServe:NzMessageService) { }

  ngOnInit(): void {
  }

  onSignIn() {
    this.memberServe.signIn().subscribe(res => {
      this.point = res.point
      this.messageServe.create('success','签到成功')
      this.showPoint = true
      timer(1500).subscribe(() => this.showPoint = false)
    }, error => {
      this.messageServe.create('error',error.msg || '签到错误')
    })
  }
}
