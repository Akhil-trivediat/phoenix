import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-sensor-registration',
  templateUrl: './sensor-registration.component.html',
  styleUrls: ['./sensor-registration.component.css']
})
export class SensorRegistrationComponent implements OnInit {
  sensorRegistrationForm: any;
  constructor(
    private requesterService: RequesterService
  ) { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.sensorRegistrationForm = new FormGroup({
      deviceID: new FormControl('', [Validators.required]),
      deviceName: new FormControl('', [Validators.required]),
      gatewayID: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      provisionDate: new FormControl('', [Validators.required])
    });
  }

  onSensorRegistrationFormSubmit(form: NgForm) {
    let requestBody = {
      action: "Add",
      type: "Sensor",
      data: form.value
    };
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(requestBody)).subscribe(
      (response) => {
        console.log(response); 
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
