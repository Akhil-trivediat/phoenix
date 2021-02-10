import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

//import { LoginService } from '../login/login.service';
import { LoginService } from '../login/login.service';
import { RequesterService } from '../../shared/service/requester.service'
import { PasswordStrengthValidator } from '../../shared/validator/password-strength.validators';
import { MismatchValidator } from '../../shared/validator/password-match.validator';
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
    confirmPassword: '',
    radiobtn: ''
  })

  radiobtn: any;
 
  constructor(
    public loginService: LoginService,
    private location: Location,
    private router: Router,
    private requesterService: RequesterService
  ) {
    this.radiobtn = "0";
   }
   accRegistrationForm: any;
  ngOnInit() {
    this.accRegistrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email] ),
      phonenum: new FormControl('', [Validators.required] ),
      password: new FormControl('', [Validators.required, Validators.minLength(8), PasswordStrengthValidator] ),
      confirmPassword: new FormControl('', [Validators.required] ),
      modeofVerification: new FormControl('0'),
      code: new FormControl('', [Validators.required] ),
      firstname: new FormControl('', [Validators.required] ),
      lastname: new FormControl('', [Validators.required] ),
      orgname: new FormControl('', [Validators.required] ),
    });
  
    
   }

   validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.accRegistrationForm.get("password").value ? null : {
        NotEqual: true
    };
  }

  

  onSendVerificationCode(accRegistrationForm: NgForm) {
    let userName: string;
    const password: string = accRegistrationForm.controls.password.value;
    const modeofVerification: string = accRegistrationForm.controls.modeofVerification.value;
    const email: string = accRegistrationForm.controls.email.value;
    const phonenumber: string = accRegistrationForm.controls.phonenum.value; 
    if(modeofVerification === "0") {
      userName = accRegistrationForm.controls.email.value;
    } else {
      userName = accRegistrationForm.controls.phonenum.value;
    }
    this.loginService.verifyUsername(userName, password, email, phonenumber).then(
      (response) => {
        console.log(response);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCancel() {
    this.location.back();
  }

  onSubmit(accRegistrationForm: NgForm) {
    const email: string = accRegistrationForm.controls.email.value;
    const confirmationCode: string = accRegistrationForm.controls.code.value;
    this.loginService.confirmSignUp(email,confirmationCode).then(
      (response) => {
        // POST call to api gateway with the user data
        this.loginService.displayAccRegistration = false;
        let postData;
        this.requesterService.addRequest('/user', postData).subscribe(
          (response) => {
            // navigate to Login Page
            this.router.navigate(['login']);
          },
          (error) => {
            this.router.navigate(['login']);
          }
        );
      },
      (error) => {
       // console.log(error);
        this.loginService.errorMessage = error.message;
      }
    );
    // POST call to api gateway
  }

  

}
