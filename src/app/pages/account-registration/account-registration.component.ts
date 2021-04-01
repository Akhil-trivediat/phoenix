import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import 'jquery';
import * as intlTelInput from 'intl-tel-input';
import "../../../../node_modules/intl-tel-input/build/js/utils.js";
import { LoginService } from '../login/login.service';
import { PasswordStrengthValidator } from '../../shared/validator/password-strength.validators';
import { MismatchValidator } from '../../shared/validator/password-match.validator';
import { AuthService } from '../../shared/service/auth.service';

const fb = new FormBuilder();


@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.css']
})
export class AccountRegistrationComponent implements OnInit {
  iti: any;
  inputTel: any;
  radiobtn: any;
  _errorMessage: string = '';
  bHideAccRegistration: boolean = false;

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

  constructor(
    private location: Location,
    private router: Router,
    public loginService: LoginService,
    private authService: AuthService
  ) {
    this.radiobtn = "0";
   }
   accRegistrationForm: any;

  private initIntTelInput(): void {
    var countryData: any;
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

  get displayAccRegistration() {
    return this.bHideAccRegistration;
  }

  set displayAccRegistration(val: boolean) {
    this.bHideAccRegistration = val;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
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

  onSignup(accRegistrationForm: NgForm) {
    let phonenumber: string = "";
    this.iti ? phonenumber = this.iti.getNumber() : "";
    const password: string = accRegistrationForm.controls.password.value;
    const email: string = accRegistrationForm.controls.email.value;
    const userName = accRegistrationForm.controls.email.value;
    
    this.authService.signup(userName, password, email, phonenumber).then(
      (response) => {
        this.errorMessage = '';
        this.displayAccRegistration = true;
      },
      (error) => {
        this.errorMessage = error.message;
        this.displayAccRegistration = false;
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
    this.authService.confirmSignUp(email,confirmationCode,formControls).then(
      (response) => {
        this.displayAccRegistration = false;
        this.router.navigate(['login']);
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
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
