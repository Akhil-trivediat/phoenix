import { Component, OnInit } from '@angular/core';
import {ColumnMode} from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  users= [{
    'active': false,
    'name': 'kiran',
    'email': 'test@trivediat.com',
    'phonenumber': '8644627222'
  },
    {
      'active': false,
      'name': 'surya',
      'email': 'demo@trivediat.com',
      'phonenumber': '8644627222'
    } ];

  constructor() { }

  ngOnInit() {
  }
 delete_user(){}
}
