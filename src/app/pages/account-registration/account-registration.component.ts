import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

//import { LoginService } from '../login/login.service';
import { LoginService } from '../login/login.service';
import { error } from 'console';

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
    password: '',
    confirmPassword: ''
  })
  //bShowAccRegistration: boolean = false;
  constructor(
    public loginService: LoginService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ongetVerificationCode(email: any,password: any) {
    //email.valid ? this.bShowAccRegistration = true : this.bShowAccRegistration = false;

    // send verification code to the email ID
    this.loginService.getVC(email,password).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    //this.loginService.sendVerificationCode(email);
  }

  onCancel() {
    this.location.back();
  }

  onSubmit(accRegistrationForm: NgForm) {
    this.loginService.confirmSignUp(accRegistrationForm.value.email,accRegistrationForm.value.Code).then(
      (response) => {
        //console.log(response);
        // navigate to Login Page
        this.router.navigate(['login']);
      },
      (error) => {
       // console.log(error);
        this.loginService.errorMessage = error.message;
      }
    );
    // POST call to api gateway
  }

  

}
