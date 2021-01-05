import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import { Location } from '@angular/common';

import { LoginService } from '../login/login.service';

const fb = new FormBuilder();


@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.css']
})
export class AccountRegistrationComponent implements OnInit {
  public formGroup: FormGroup = fb.group({
    firstname: '',
    lastname: '',
    orgname: '',
    phonenum: '',
    email: '',
    password: ''
  })
  bShowAccRegistration: boolean = false;
  constructor(
    private loginService: LoginService,
    private location: Location,
  ) { }

  ngOnInit() {
  }

  ongetVerificationCode(email: any) {
    email.valid ? this.bShowAccRegistration = true : this.bShowAccRegistration = false;

    // send verification code to the email ID
    this.loginService.sendVerificationCode(email);
  }

  onCancel() {
    this.location.back();
  }

  onSubmit(accRegistrationForm: NgForm) {
    // POST call to api gateway
    
    // navigate to Login Page
  }

  

}
