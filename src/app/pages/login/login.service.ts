import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { AppService } from '../../app.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Auth } from 'aws-amplify';
import { NgForm, NgModel } from '@angular/forms';

import { ChallengeName } from './login.data';

const jwt = new JwtHelperService();

@Injectable()
export class LoginService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';
  bHideAccRegistration: boolean = false;

  challengeName:Array<string> = ChallengeName;

  constructor(
    appConfig: AppConfig,
    private http: HttpClient,
    private router: Router
  ) {
    this.config = appConfig.getConfig();
  }

  get isFetching() {
    return this._isFetching;
  }

  set isFetching(val: boolean) {
    this._isFetching = val;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  get displayAccRegistration() {
    return this.bHideAccRegistration;
  }

  set displayAccRegistration(val: boolean) {
    this.bHideAccRegistration = val;
  }

  // Login Operations
  logIn(username: string, password: string) {
    this.requestLogin();
    Auth.signIn(username, password).then((result) => {
      if (result) {
        this.receiveLogin();
        
       // AppService.setLogin(true);
        
        if(result.challengeName === this.challengeName[9]){
          this.router.navigate(['forgotpassword']);
        } else {
          AppService.saveToken(result);
          this.router.navigate(['app/main']);
        }
        
      }
    }).catch(error => {
      console.log(error);
      this.loginError(error.message);
    });
  }

  loginError(errorMessage: string) {
    this.isFetching = false;
    this.errorMessage = errorMessage;
  }

  receiveLogin() {
    this.isFetching = false;
    this.errorMessage = '';
    //this.router.navigate(['/app/main/visits']);
  }

  requestLogin() {
    this.isFetching = true;
  }

  // Logout Operations
  logOut() {
    Auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        console.log(err);
    });
  }

  // Reset Password: This will reset the password.
  resetPassword(resetForm: NgForm): Promise<any> {
    var formDetails = resetForm.form.value;
    return Auth.currentAuthenticatedUser()
     .then(user => {
        return Auth.changePassword(user, formDetails.oldPassword, formDetails.newPassword);
    });
  }

  // Change Password: This will create a new password if you forget password.
  changePassword(changePasswordForm: NgForm): Promise<any> {
    var formDetails = changePasswordForm.form.value;
    var isResolved;
    return Auth.forgotPasswordSubmit(formDetails.email, formDetails.Code, formDetails.NewPassword)
    .then(data => {
      return isResolved=true;
    });

    
    // .catch(err => {
    //   return err;
    // })
  }

  // Send Verification Code: This will send verification code to the corresponding email id.
  sendVerificationCode(emailID: any): Promise<any> {
    let email = emailID.form ? emailID.form.value.email : emailID.value;
    return Auth.forgotPassword(email)
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
  }

  verifyUsername(userName: string,password: string,email: string, phonenumber: string): Promise<any> {
    return Auth.signUp(
      {
        username: userName,
        password: password,
        attributes: {
          email: email
          //phonenumber: phonenumber
        }
      }
    )
    .then(data => {
      this.displayAccRegistration = true;
      this.errorMessage = '';
      return data;
    
    })
    .catch(err => {
      this.displayAccRegistration = false;
      this.loginError(err.message);
      return err;
    }); 
  }

  getVC(email,password): Promise<any> {
    // return Auth.signUp(email.value,password.value).then(
    //   data => {
    //     console.log(data);
    //   }
    // ).catch(
    //   err => {
    //     console.log(err);
    //   }
    // );
    return Auth.signUp(
      {
        username: email,
        password: password,
        attributes: {
          email: email
        }
      }
    )
    .then(data => {
      this.displayAccRegistration = true;
      this.errorMessage = '';
      return data;
    
    })
    .catch(err => {
      this.displayAccRegistration = false;
      this.loginError(err.message);
      return err;
    });
  }

  confirmSignUp(email: string,code: string,attributes: any): Promise<any> {
    let userAttributes = {
      clientMetadata : {
        address: "Toronto",
        companyname: attributes.orgname.value,
        email: email,
        firstname: attributes.firstname.value,
        lastname: attributes.lastname.value,
        password: attributes.password.value,
        phonenumber: attributes.phonenum.value ? attributes.phonenum.value : "",
        timezone: "EST"
      }
    };
    return Auth.confirmSignUp(email,code,userAttributes)
    .then((data) => 
      {
        return data;
      });
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');

    // We check if app runs with backend mode
    if (!this.config.isBackend && token) {
      return true;
    }
    if (!token) {
      return;
    }
    const date = new Date().getTime() / 1000;
    const data = jwt.decodeToken(token);
    return date < data.exp;
  }

  loginUser(creds) {
    // We check if app runs with backend mode
    if (!this.config.isBackend) {
      this.receiveToken('token');
    } else {
      this.requestLogin();
      if (creds.social) {
        // tslint:disable-next-line
        window.location.href = this.config.baseURLApi + '/user/signin/' + creds.social + (process.env.NODE_ENV === 'production' ? '?app=light-blue/angular' : '');
      } else if (creds.email.length > 0 && creds.password.length > 0) {
        this.http.post('/user/signin/local', creds).subscribe((res: any) => {
          const token = res.token;
          this.receiveToken(token);
        }, err => {
          this.loginError(err.response.data);
        });

      } else {
        this.loginError('Something was wrong. Try again');
      }
    }
  }

  receiveToken(token) {
    let user: any = {};
    // We check if app runs with backend mode
    if (this.config.isBackend) {
      user = jwt.decodeToken(token).user;
      delete user.id;
    } else {
      user = {
        email: this.config.auth.email
      };
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.receiveLogin();
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.router.navigate(['/login']);
  }
}
