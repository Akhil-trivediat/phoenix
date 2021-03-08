import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sensor } from '../../../models/commonmodel.data';
import { RequesterService } from '../../../shared/service/requester.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxDialogComponent } from 'src/app/shared/component/ngx-dialog/ngx-dialog.component';
import { config } from 'process';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  private readonly GATEWAY_ID = 'GATEWAY_ID';
  bsModalRef: BsModalRef;

  constructor(
    private requesterService: RequesterService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private http: HttpClient
  ) { }
  sensorsArray = [];

  ngOnInit() {
    this.spinner.show();
    this.removeToken();
    this.getSensorList();
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getSensorList() {
    let sensorArray = [];
    let params = new HttpParams();
    params = params.append('email', this.getUserDetails());
    params = params.append('gatewayID', 'all');

    this.requesterService.getRequestParams("/sensor", params).subscribe(
      (sensorsList) => {
        this.sensorsArray = sensorsList;
        sensorsList.forEach((sensor: Array<Sensor>) => {
          (sensorArray as Array<Sensor>).push({
            'sensorName': sensor["productname"],
            'sensorid': sensor["id"],
            'status': '',
            'gateway': sensor["gatewayname"],
            'activationdate': sensor["createddate"],
            'lastconnected': ''
          });
        });
        this.sensorsArray = sensorArray;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onRefresh() {
    this.spinner.show();
    this.getSensorList();
  }

  onAssignGateway(sensorID: string,gatewayID: string) {
    localStorage.setItem(this.GATEWAY_ID, gatewayID);
    const path = "/app/sensor/" + sensorID + "/assignGateway";
    this.router.navigate([path]);
  }

  private removeToken() {
    localStorage.removeItem(this.GATEWAY_ID);
  }

  prepareFormControl(userObject: any) {
    const formControls: any = [
      {
        key: 'sensorId',
        label: 'Sensor ID: ',
        value: userObject.sensorid,
        required: false,
        disabled: true,
        order: 1,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'sensorName',
        label: 'Sensor Name: ',
        value: userObject.sensorName,
        required: true,
        disabled: false,
        order: 2,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'status',
        label: 'Status: ',
        value: userObject.status,
        required: false,
        disabled: true,
        order: 3,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'gateway',
        label: 'Gateway: ',
        value: userObject.gateway,
        required: false,
        disabled: true,
        order: 4,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'activationdate',
        label: 'Activation Date: ',
        value: userObject.activationdate,
        required: false,
        disabled: true,
        order: 5,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'lastconnected',
        label: 'Last Connected: ',
        value: userObject.lastconnected,
        required: false,
        disabled: true,
        order: 6,
        controlType: 'textbox',
        type: 'text'
      }
    ];

    return formControls;
  }

  openDialog(action: string, userObject: any) {
    let formControls = this.prepareFormControl(userObject);

    const initialState = {
      dialogObj : {
        action: action,
        type: "Sensor",
        formControls: formControls
      }
    }

    this.bsModalRef = this.modalService.show(NgxDialogComponent, {initialState});
    this.bsModalRef.content.onClose.subscribe(
      (response: any) => {
        //console.log(response);
        if(response.action === "Delete") {
          const sensorID = response.data.getRawValue().sensorId;
          this.deleteRequest(sensorID);
        } else if(response.action === "Edit") {
          // update sensor
          const sensorID = response.data.getRawValue().sensorId;
          const sensorName = response.data.getRawValue().sensorName;
          this.updateRequest(sensorID,sensorName);
        }
      }
    )
  }

  updateRequest(sensorID: string, sensorName: string) {
    let params = new HttpParams();
    params = params.append('sensorID', sensorID);
    params = params.append('sensorName', sensorName);
    this.requesterService.updateRequest("/sensor", params).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteRequest(sensorID: string) {
    let requestBody = {
      sensorID: sensorID
    };

    let params = new HttpParams();
    params = params.append('sensorID', sensorID);

    this.requesterService.deleteRequest("/sensor", params).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );

    // this.deleteRequesthttp("/sensor", params).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}