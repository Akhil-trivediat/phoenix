import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Gateway } from '../../../models/commonmodel.data';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-gateways-list',
  templateUrl: './gateways-list.component.html',
  styleUrls: ['./gateways-list.component.css']
})
export class GatewaysListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  emptyRowObj: any = {
    gatewayName: "",
    gatewayID: "",
    status: "",
    sensor: "",
    activationDate: "",
    lastConnected: ""
  };
  gatewaysArray = [];
  constructor(
    private requesterService: RequesterService
  ) { }

  ngOnInit() {
    this.getGatewaysList();
  }

  getGatewaysList() {
    let gatewayArray = [];
    this.requesterService.getRequest("/gateway").subscribe(
      (gatewaysList) => {
        gatewaysList.forEach((gateway: Array<Gateway>) => {
          (gatewayArray as Array<Gateway>).push({
            'gatewayName': gateway["gatewayName"],
            'gatewayid': gateway["gatewayid"],
            'status': gateway["status"],
            'sensor': gateway["sensor"],
            'activationdate': gateway["activationdate"],
            'lastconnected': gateway["lastconnected"]
          });
        });
        this.gatewaysArray = gatewayArray;
      },
      (error) => {
        console.log("error");
      }
    );
  }
}
