import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Gateway } from '../../../models/commonmodel.data';
import { Router, NavigationExtras } from '@angular/router';
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

  navigationExtras: NavigationExtras = {
    state : {
      gatewayID : ""
    }
  };
  constructor(
    private requesterService: RequesterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getGatewaysList();
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getGatewaysList() {
    let gatewayArray = [];
    const email = this.getUserDetails();
    this.requesterService.getRequest("/gateway" + "?email=" + email).subscribe(
      (gatewaysList) => {
        gatewaysList.forEach((gateway) => {
          (gatewayArray).push({
            'gatewayName': gateway["productname"],
            'gatewayid': gateway["id"],
            'status': gateway["status"],
            'sensor': gateway["sensor"],
            'activationdate': gateway["createddate"],
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

  onRefresh() {
    this.getGatewaysList();
  }

  onAssignSensor(gatewayID: any) {
    this.navigationExtras = {
      state : {
        gatewayID : gatewayID
      }
    };
    this.router.navigate(['/app/gateway/assignSensor'], this.navigationExtras);
  }
}
