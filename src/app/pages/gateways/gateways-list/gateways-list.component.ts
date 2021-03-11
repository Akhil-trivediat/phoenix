import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Gateway } from '../../../models/commonmodel.data';
import { RequesterService } from '../../../shared/service/requester.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { NgxDialogComponent } from 'src/app/shared/component/ngx-dialog/ngx-dialog.component';

@Component({
  selector: 'app-gateways-list',
  templateUrl: './gateways-list.component.html',
  styleUrls: ['./gateways-list.component.css']
})
export class GatewaysListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  bsModalRef: BsModalRef;

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
    private requesterService: RequesterService,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.spinner.show();
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
        this.spinner.hide();
      },
      (error) => {
        console.log("error");
        this.notificationService.error(error.error.message);
        this.spinner.hide();
      }
    );
  }

  onRefresh() {
    this.spinner.show();
    this.getGatewaysList();
  }

  onAssignSensor(gatewayID: any) {
    const path = "/app/gateway/" + gatewayID + "/assignSensor";
    this.router.navigate([path]);
  }

  openDialog(action: string, rowObject: any) {
    const initialState = {
      dialogObj : {
        action: action,
        type: "Gateway",
        formControls: ""
      }
    }

    this.bsModalRef = this.modalService.show(NgxDialogComponent, {initialState});
    this.bsModalRef.content.onClose.subscribe(
      (response: any) => {
        this.deleteGateway(rowObject.gatewayid);
      }
    )
  }

  deleteGateway(gatewayID: string) {
    let params = new HttpParams();
    params = params.append('gatewayID', gatewayID);

    this.requesterService.deleteRequest("/gateway", params).subscribe(
      (response) => {
        console.log(response);
        this.getGatewaysList();
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
