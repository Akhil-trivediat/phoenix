import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { PubsubService } from '../../shared/service/pubsub.service';
import { RequesterService } from '../../shared/service/requester.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string;
  location: string;
  totalGatewayCount: string;
  activeGatewayCount: string;
  totalSensorCount: string;
  activeSensorCount: string;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private pubsubService: PubsubService,
    private requesterService: RequesterService,
  ) {
    this.subscribetoMQTT();
   }

  ngOnInit() {
    this.spinner.show();
    this.getUserDetails();
    this.getAllGateways();
    this.getAllSensors();
  }

  getUserDetails() {
    this.setUserName(localStorage.getItem('USER_NAME'));
    this.getLocation(localStorage.getItem('USER_NAME'));
  }

  setUserName(username: string): void {
    this.username = username;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  getLocation(username: string) {
    const email = this.username;
    this.requesterService.getRequest("/location" + "?email=" + email).subscribe(
        (response) => {
            this.setLocation(response[0] ? response[0].state : "");
            this.spinner.hide();
        },
        (error) => {
            console.log(error);
            this.spinner.hide();
        }
    );
  }

  getAllGateways() {
    const email = this.username;
    //const email = "suryasnata@trivediat.com";
    this.requesterService.getRequest("/gateway" + "?email=" + email).subscribe(
      (gatewaysList) => {
        this.publishtoMQTTforGateway(gatewaysList);
        this.totalGatewayCount = gatewaysList.length;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  publishtoMQTTforGateway(gatewayList: any) {
    gatewayList.forEach((gateway: any) => {
      this.publishtoMQTT(gateway.id);
    });
  }

  getActiveGatewayCount(data: any) {
    let activeGatewayCount: number = 0;
    if(data.value.aws_connection_status.toLocaleLowerCase() === "connected") {
      activeGatewayCount++;
    }
    this.activeGatewayCount = activeGatewayCount.toString();
    //console.log("count of active gateways", this.activeGatewayCount);
  }

  getAllSensors() {
    let email = this.username;
    let params = new HttpParams();
    params = params.append('email', this.username);
    params = params.append('gatewayID', 'all');
    this.requesterService.getRequest("/sensor" + "?email=" + email + "&gatewayID=all").subscribe(
      (sensorList) => {
        this.totalSensorCount = sensorList.length;
        this.getActiveSensorCount(sensorList);
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  getActiveSensorCount(sensorList: any) {
    let activeSensorCount: number = 0;
    sensorList.forEach((sensor: any) => {
      if(sensor.status === "Online"){
        activeSensorCount++;
      }
    });
    this.activeSensorCount = activeSensorCount.toString();
  }

  addDeviceNav(path: string){
    this.router.navigate([path]);
  }

  subscribetoMQTT() {
    this.pubsubService.subscribetoMQTT().subscribe(
      data => {
        this.getActiveGatewayCount(data);
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
      topic: "config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
