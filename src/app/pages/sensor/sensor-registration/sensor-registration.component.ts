import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-sensor-registration',
  templateUrl: './sensor-registration.component.html',
  styleUrls: ['./sensor-registration.component.css']
})
export class SensorRegistrationComponent implements OnInit {
  sensorRegistrationForm: any;

  constructor(
    private requesterService: RequesterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prepareForm();
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
}
