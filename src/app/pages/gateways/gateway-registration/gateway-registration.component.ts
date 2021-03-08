import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RequesterService } from '../../../shared/service/requester.service';
import { NotificationService } from '../../../shared/service/notification.service';

@Component({
  selector: 'app-gateway-registration',
  templateUrl: './gateway-registration.component.html',
  styleUrls: ['./gateway-registration.component.css']
})
export class GatewayRegistrationComponent implements OnInit {
  gatewayRegistrationForm: any;

  constructor(
    private requesterService: RequesterService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.gatewayRegistrationForm = new FormGroup({
      deviceID: new FormControl('', [Validators.required]),
      deviceName: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required])
    });
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  onGatewayRegistrationFormSubmit(form: NgForm){
    let gatewayData = {
      deviceID: form.value.deviceID,
      deviceName: form.value.deviceName,
      location: form.value.location,
      email: this.getUserDetails()
    };
    let requestBody = {
      action: "Add",
      type: "Gateway",
      data: gatewayData
    };
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(requestBody)).subscribe(
      (response) => {
        this.notificationService.success("Gateway added successfully."); 
        this.router.navigate(['/app/gateway']);
      },
      (error) => {
        console.log(error);
        this.notificationService.error(error.error.message);
      }
    );
  }
}
