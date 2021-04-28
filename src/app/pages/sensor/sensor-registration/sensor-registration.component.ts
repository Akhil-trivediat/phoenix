import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RequesterService } from '../../../shared/service/requester.service';
import { PubsubService } from '../../../shared/service/pubsub.service';

@Component({
  selector: 'app-sensor-registration',
  templateUrl: './sensor-registration.component.html',
  styleUrls: ['./sensor-registration.component.css']
})
export class SensorRegistrationComponent implements OnInit {

  selectedSensor: any;
  sensorRegistrationForm: any;
  gatewayList: Array<Object>;

  constructor(
    private router: Router,
    private pubsubService: PubsubService,
    private requesterService: RequesterService,
  ) { }

  ngOnInit() {

    this.prepareForm();

    this.getAllGatewaysList();

  }

  prepareForm() {
    this.sensorRegistrationForm = new FormGroup({
      deviceID: new FormControl('', [Validators.required]),
      deviceName: new FormControl('', [Validators.required]),
      gatewayID: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required])
    });
  }

  disableSubmitButton(sensorRegistrationForm: NgForm) {
    if(sensorRegistrationForm.controls.deviceID.invalid ||
      sensorRegistrationForm.controls.deviceName.invalid ||
      sensorRegistrationForm.controls.location.invalid) {
        return true
    } else {
      return false
    }
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  onSensorRegistrationFormSubmit(form: NgForm) {
    let sensorData = {
      sensorID: form.value.deviceID,
      sensorName: form.value.deviceName,
      gatewayID: form.value.gatewayID,
      location: form.value.location,
      email: this.getUserDetails()
    };
    let requestBody = {
      action: "Add",
      type: "Sensor",
      data: sensorData
    };
    this.publishtoMQTT(requestBody);
  }

  publishtoMQTT(requestBody: any) {
    let deviceConfigJSON = {
      "clientId": requestBody.data.gatewayID,
      "command": "ADDTRANSMITTER",
      "transmitterids": [+requestBody.data.sensorID]
    }

    let IOTParams = {
      topic: "config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
        this.addSensor(requestBody);
      }, 
      (error) => {
        console.log(error);
      }
    );
  }
  addSensor(requestBody: any) {
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(requestBody)).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/app/sensor']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllGatewaysList() {
    let gatewayArray = [];
    const email = this.getUserDetails();

    this.requesterService.getRequest("/gateway" + "?email=" + email).subscribe(
      (gatewaysList) => {
        gatewaysList.forEach((gateway) => {
          (gatewayArray).push({
            id: gateway["id"]
          });
        });
        this.gatewayList = gatewayArray;
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
