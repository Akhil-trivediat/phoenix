import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import 'jquery';
import * as intlTelInput from 'intl-tel-input';
import "../../../../node_modules/intl-tel-input/build/js/utils.js";

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
  inputTel: any;
  iti: any;

  @ViewChild('phoneCode', {static:false})
    set ele(element: ElementRef) {
      this.inputTel = element;
      this.inputTel ? this.initIntTelInput() : "";
  }
  
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

  private initIntTelInput(): void {
    var countryData;
    if(this.iti) {
      countryData = this.iti.getSelectedCountryData();
      this.iti.destroy();
    }
    this.iti = intlTelInput(this.inputTel.nativeElement, {
      utilsScript: "../../../../node_modules/intl-tel-input/build/js/utils.js",
      allowDropdown: true,
      separateDialCode: true,
      formatOnDisplay:true,
      initialCountry: "us",
      preferredCountries: ["us","ca"]
    });
    if(countryData) {
      this.iti.setCountry(countryData.iso2);
    }
  } 

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
    let phonenumber: string = "";
    this.iti ? phonenumber = this.iti.getNumber() : "";
    const password: string = accRegistrationForm.controls.password.value;
    const email: string = accRegistrationForm.controls.email.value;
    const userName = accRegistrationForm.controls.email.value;
    
    this.loginService.verifyUsername(userName, password, email, phonenumber).then(
      (response) => {
        //console.log(response);
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
    const formControls: any = accRegistrationForm.controls;
    const email: string = accRegistrationForm.controls.email.value;
    const confirmationCode: string = accRegistrationForm.controls.code.value;
    this.loginService.confirmSignUp(email,confirmationCode,formControls).then(
      (response) => {
        // POST call to api gateway with the user data
        this.loginService.displayAccRegistration = false;
        let postData;
        this.router.navigate(['login']);
        // this.requesterService.addRequest('/user', postData).subscribe(
        //   (response) => {
        //     // navigate to Login Page
        //     this.router.navigate(['login']);
        //   },
        //   (error) => {
        //     this.router.navigate(['login']);
        //   }
        // );
      },
      (error) => {
       // console.log(error);
        this.loginService.errorMessage = error.message;
      }
    );
    // POST call to api gateway
  }

  disableSubmitButton(accRegistrationForm: NgForm) {
    if(accRegistrationForm.controls.email.invalid || 
      accRegistrationForm.controls.password.invalid ||
      accRegistrationForm.controls.confirmPassword.invalid || 
      ( accRegistrationForm.controls.modeofVerification.value === '1' && accRegistrationForm.controls.phonenum.invalid ) ||
      accRegistrationForm.controls.code.invalid ||
      accRegistrationForm.controls.firstname.invalid ||
      accRegistrationForm.controls.lastname.invalid ||
      accRegistrationForm.controls.orgname.invalid) {
        return true
    } else {
      return false
    }
  }

  

}
