import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { RequesterService } from '../../../shared/service/requester.service';
import { NotificationService } from '../../../shared/service/notification.service';

@Component({
  selector: 'app-assign-sensor',
  templateUrl: './assign-sensor.component.html',
  styleUrls: ['./assign-sensor.component.css']
})
export class AssignSensorComponent implements OnInit {
  assignSensorForm: any;
  gatewayID: string;
  ddSensorsList: Array<Object>;
  selectedSensor: any;

  constructor(
    private route: ActivatedRoute,
    private requesterService: RequesterService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gatewayID = params['id'];
    });
    this.prepareForm();
    this.getSensorList();
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getSensorList() {
    let params = new HttpParams();
    params = params.append('email', this.getUserDetails());
    params = params.append('gatewayID', 'no');

    this.requesterService.getRequestParams("/sensor", params).subscribe(
      (response) => {
        let sensorArray = [];
        response.forEach((sensor: any) => {
          sensorArray.push({
            id: sensor.id
          });
        });
        this.ddSensorsList = sensorArray;
      },
      (error) => {
        console.log(error);
        this.notificationService.error(error.error.message);
      }
    );
  }

  prepareForm() {
    this.assignSensorForm = new FormGroup({
      sensorID: new FormControl('', [Validators.required]),
      gatewayID: new FormControl({value: this.gatewayID, disabled: true}, [Validators.required]),
      location: new FormControl('', [Validators.required])
    });
  }

  onassignSensorFormSubmit(form: NgForm){
    let sensorData = {
      "clientId": form.value.gatewayID,
      "command": "ADDTRANSMITTER",
      "transmitterids": [form.value.sensorID.id]
    }

    let payload = {
      topicName: "/cmd/dcc/"+ form.value.gatewayID +"/addtransmitter/req",
      eventName: "",
      sensorDetails: sensorData
    }

    let requestBody = {
      action: "Assign",
      type: "Sensor",
      data: payload
    };
    
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(requestBody)).subscribe(
      (response) => {
        console.log(response); 
        this.notificationService.success("Sensor is assigned successfully to the gateway.");
      },
      (error) => {
        console.log(error);
        this.notificationService.error(error.error.message);
      }
    );
  }

}
