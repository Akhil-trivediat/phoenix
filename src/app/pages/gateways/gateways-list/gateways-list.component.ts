import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-gateways-list',
  templateUrl: './gateways-list.component.html',
  styleUrls: ['./gateways-list.component.css']
})
export class GatewaysListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  emptyRowObj: any = {
    name: "",
    id: "",
    product: ""
  };
  gatewaysArray = [];
  constructor(
    private requesterService: RequesterService
  ) { }

  ngOnInit() {
    this.getGatewaysList();
  }

  getGatewaysList() {
    this.requesterService.getRequest("/account/user/gateway").subscribe(
      (gatewaysList) => {
        this.gatewaysArray = gatewaysList;
      },
      (error) => {
        console.log("error");
      }
    );
  }
}
