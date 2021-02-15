import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-device-registration',
  templateUrl: './device-registration.component.html',
  styleUrls: ['./device-registration.component.css']
})
export class DeviceRegistrationComponent implements OnInit {
  deviceRegistrationForm: any;

  constructor(
    private requesterService: RequesterService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.deviceRegistrationForm = new FormGroup({
      deviceID: new FormControl('', [Validators.required]),
      deviceName: new FormControl('', [Validators.required])
    });
  }

  ondeviceRegistrationFormSubmit(form: NgForm) {
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(form.value)).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
