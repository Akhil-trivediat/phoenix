import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Gateway } from '../../../models/commonmodel.data';
import { PubsubService } from '../../../shared/service/pubsub.service';
import { RequesterService } from '../../../shared/service/requester.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { NgxDialogComponent } from 'src/app/shared/component/ngx-dialog/ngx-dialog.component';
import {string} from "@amcharts/amcharts4/core";

@Component({
  selector: 'app-gateways-list',
  templateUrl: './gateways-list.component.html',
  styleUrls: ['./gateways-list.component.css']
})
export class GatewaysListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  bsModalRef: BsModalRef;
  searchGateway : string;

  emptyRowObj: any = {
    gatewayName: "",
    gatewayID: "",
    status: "",
    sensor: "",
    activationDate: "",
    lastConnected: ""
  };
  gatewaysArray = [];
  backupGatewayArray = [];
  private status: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private pubsubService: PubsubService,
    private requesterService: RequesterService,
    private notificationService: NotificationService,
    @Inject(LOCALE_ID) private locale: string,
  ) {

    // this.route.paramMap.filter(params => params['status']).subscribe(params => {
    //   this.status = params['status'];
    // });
    
  }

  ngOnInit() {

    // this.route.queryParams.subscribe(params => {
    //   if(params.status == null && this.status != null){
    //     this.status = null;
    //     this.spinner.show();
    //     this.getGatewaysList();
    //   }
    // });

    this.route.queryParams.subscribe(params => {
      this.status = params.status || null;
    });

    this.spinner.show();

    this.getGatewaysList();

  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  gotoGatewayDetailsScreen(gatewayid: any) {
    this.router.navigate(['id/', gatewayid],{relativeTo: this.route});
  }

  filterGateway(event) {
    this.gatewaysArray = this.backupGatewayArray;

    if(this.searchGateway != '') {

      const val = event.target.value.toLowerCase();

      this.gatewaysArray = this.gatewaysArray.filter(x => {
        return (x.gatewayName.toLocaleLowerCase().includes(val)
          || x.gatewayid.toLocaleLowerCase().includes(val));
      });

    }
  }

  getGatewaysList() {
    let gatewayArray = [];
    const email = this.getUserDetails();
    this.requesterService.getRequest("/gateway" + "?email=" + email).subscribe(
      (gatewaysList) => {
        gatewaysList.forEach((gateway) => {

        //  this.subscribetoMQTT(gateway["id"]);

          this.publishtoMQTT(gateway["id"]);

          (gatewayArray).push({
            'gatewayName': gateway["productname"],
            'gatewayid': gateway["id"],
            'status': gateway["status"] ? gateway["status"] : "Offline",
            'sensor': gateway["sensor"],
            'activationdate': gateway["createddate"].length > 0 ? formatDate(gateway["createddate"],'MM/dd/yyyy,HH:mm',this.locale) : gateway["createddate"],
            'lastconnected': gateway["lastconnected"]
          });
        });
        if(this.status != null) {
          this.gatewaysArray = gatewayArray.filter(value => value.status == this.status);
        }
        else {
          this.gatewaysArray = gatewayArray;
        }
        // this.gatewaysArray = gatewayArray;
        this.backupGatewayArray = this.gatewaysArray;
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

  setGatewayStatus(data: any) {
    this.gatewaysArray.forEach((gateway: any) => {
      if(gateway.gatewayid === data.value.clientId){
        if(data.value.aws_connection_status.toLocaleLowerCase() === "connected"){
          gateway.status = "Online";
        } else {
          gateway.status = "Offline";
        }
      }
      console.log("Status set");
    });
  }

  subscribetoMQTT(clientId: any) {

    let subTopic = clientId + this.pubsubService.getSubscriptionTopic();

    this.pubsubService.subscribetoMQTT(subTopic).subscribe(
      data => {
        console.log(data);
        this.setGatewayStatus(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  publishtoMQTT(gatewayID: string) {
    let deviceConfigJSON = {
      "clientId": gatewayID,
      "command": "CMD_INFO"
    }

    let IOTParams = {
      topic: gatewayID + this.pubsubService.getPublishTopic(),
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
