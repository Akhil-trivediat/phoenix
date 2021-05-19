import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { formatDate } from '@angular/common';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sensor } from '../../../models/commonmodel.data';
import { RequesterService } from '../../../shared/service/requester.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxDialogComponent } from 'src/app/shared/component/ngx-dialog/ngx-dialog.component';
import { SensorService } from '../services/sensor.service';

import { HttpClient } from '@angular/common/http';
import {string} from "@amcharts/amcharts4/core";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  private readonly GATEWAY_ID = 'GATEWAY_ID';
  bsModalRef: BsModalRef;
  sensorDetails: any;
  filterText : string;
  private sub: Subscription;
  status: number;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private requesterService: RequesterService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sensorService: SensorService
  ) { }
  sensorsArray = [];
  backupSensorArray = [];

  ngOnInit() {

    this.spinner.show();

    this.removeToken();

    this.getSensorList();
    this.sub = this.route
      .paramMap
      // .filter(params => params.status)
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.status = +params['status'] || 0;
        console.log(status);
      });
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
          let currReading: string = "";
          if(sensor["currentReading"]) {
            if(!sensor["currentReading"].toString().includes("e") ) {
              currReading = parseFloat(sensor["currentReading"]).toFixed(2) + " " + sensor["readingUnit"];
            }
          }

          (sensorArray as Array<Sensor>).push({
            'sensorName': sensor["productname"],
            'sensorid': sensor["id"],
            'status': sensor["status"],
            'gateway': sensor["gatewayname"],
            'activationdate': formatDate(sensor["createddate"],'MM/dd/yyyy,HH:mm',this.locale),
            'lastconnected': formatDate(sensor["lastCommDate"],'MM/dd/yyyy,HH:mm',this.locale),
            'sensorType': sensor["sensorType"],
            'currentReading': currReading
          });
        });
        this.sensorsArray = sensorArray;
        this.backupSensorArray = this.sensorsArray;
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

  filterSensor(event) {
    this.sensorsArray = this.backupSensorArray;

    if(this.filterText != '') {

      const val = event.target.value.toLowerCase();

      this.sensorsArray = this.sensorsArray.filter(x => {
        return (x.sensorName.toLocaleLowerCase().includes(val)
          || x.sensorid.toLocaleLowerCase().includes(val));
      });

    }
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
        required: false,
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
      },
      {
        key: 'mintempthreshold',
        label: 'Minimun Thershold: ',
        value: this.sensorDetails.minThreshold,
        required: false,
        disabled: false,
        order: 7,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'maxtempthreshold',
        label: 'Maximum Thershold: ',
        value: this.sensorDetails.maxThreshold,
        required: false,
        disabled: false,
        order: 7,
        controlType: 'textbox',
        type: 'text'
      }
    ];

    return formControls;
  }

  openDialog(action: string, userObject: any) {

    this.sensorService.getSensorDetailswithFormattedResponseasPromise(userObject.sensorid).then(
      (sensor) => {

        this.sensorDetails = {
          name: sensor.name,
          gatewayName: sensor.gatewayName,
          readingValue: sensor.readingValue,
          lastCommDate: sensor.lastCommDate,
          location: sensor.location,
          minThreshold: sensor.minThreshold,
          maxThreshold: sensor.maxThreshold,
          status: sensor.status
        };

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

              if(!response.data.pristine) {
                // const sensorID = response.data.getRawValue().sensorId;
                // const sensorName = response.data.getRawValue().sensorName;
                // const mintempthreshold = response.data.getRawValue().mintempthreshold;
                // const maxtempthreshold = response.data.getRawValue().maxtempthreshold;

                let updateRequestBody = {
                  'sensorID': response.data.getRawValue().sensorId,
                  'sensorName': response.data.getRawValue().sensorName,
                  'mintempthreshold': response.data.getRawValue().mintempthreshold,
                  'maxtempthreshold': response.data.getRawValue().maxtempthreshold
                };

                this.updateRequest(updateRequestBody);
              }

            }
          }
        )

      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );

  }

  gotoSensorDetailsScreen(sensorid: any) {
    this.router.navigate(['id/', sensorid],{relativeTo: this.route});
  }

  updateRequest(updateRequestBody: any) {
    let params = new HttpParams();
    params = params.append('sensorID', updateRequestBody.sensorID);
    params = params.append('sensorName', updateRequestBody.sensorName);
    params = params.append('mintempthreshold', updateRequestBody.mintempthreshold);
    params = params.append('maxtempthreshold', updateRequestBody.maxtempthreshold);
    params = params.append('updateField', 'sensorname');
    let postData = {
      'sensorID': updateRequestBody.sensorID,
      'sensorName': updateRequestBody.sensorName,
      'updateField': 'sensorname',
      'mintempthreshold': updateRequestBody.mintempthreshold,
      'maxtempthreshold': updateRequestBody.maxtempthreshold
    };
    this.requesterService.updateRequest("/sensor", postData).subscribe(
      (response) => {
        console.log(response);
        this.getSensorList();
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
        this.getSensorList();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
