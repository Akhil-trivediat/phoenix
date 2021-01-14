import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import { AppService } from '../../app.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Auth } from 'aws-amplify';
import { NgForm, NgModel } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChallengeName } from '../../pages/login/login.data';

const jwt = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';

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

  private storeSessionData(sessionData: any){ //using
    let user: any = {};
    const token = sessionData.getSignInUserSession().getAccessToken().getJwtToken();
    user = {
      email: jwt.decodeToken(token).username
    };
    const expDate = jwt.getTokenExpirationDate(token);

    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    localStorage.setItem('expDate', expDate.toString());
  }

  private removeSessionData(){ //using
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expDate');
  }

  // Login Operations
  login(username: string, password: string) { // using
    this.requestLogin();
    Auth.signIn(username, password).then((result) => {
      if (result) {
        this.receiveLogin();
        
        AppService.setLogin(true);
        
        if(result.challengeName === this.challengeName[9]){
          this.router.navigate(['forgotpassword']);
        } else {
          AppService.saveToken(result);
          this.storeSessionData(result);
          this.router.navigate(['app/main']);
        }
        
      }
    }).catch(error => {
      console.log(error);
      this.loginError(error.message);
    });
  }

  receiveLogin() { // using
    this.isFetching = false;
    this.errorMessage = '';
    //this.router.navigate(['/app/main/visits']);
  }

  requestLogin() { //using
    this.isFetching = true;
  }

  loginError(errorMessage: string) { // using
    this.isFetching = false;
    this.errorMessage = errorMessage;
  }

  // Logout Operations
  logOut() { // using
    Auth.signOut()
      .then(() => {
        this.removeSessionData();
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        console.log(err);
    });
  }

  // checks if user is still logged in
  // true - session is valid & false - session invalid
  async isSessionValid(){ // used
    let isValid: boolean = false;
    this.getAuthorizationToken().subscribe(
      (response) => {
        //console.log(response);

        let exp_date = this.getExpirationDate(response);
        let now: Date = new Date();
        isValid = now < exp_date;
      },
      (error) => {
        console.log(error);
        isValid = false;
      }
    );
  }

  // get the expiration date
  getExpirationDate(token): Date{ // used
    return jwt.decodeToken(token);
  }

  getAuthorizationToken(){ // used
    return from(Auth.currentSession()).pipe(
      map((session) => session.getIdToken().getJwtToken())
    );
  }

  getCurrentUserInfo(): Promise<any> { // used
    return Auth.currentUserInfo().then(
      (userInfo) => {
        return userInfo;
      }
    );
  }

  

  

  

  // Reset Password: This will reset the password.
  resetPassword(resetForm: NgForm): Promise<any> { // using
    var formDetails = resetForm.form.value;
    return Auth.currentAuthenticatedUser()
     .then(user => {
        return Auth.changePassword(user, formDetails.oldPassword, formDetails.newPassword);
    });
  }

  // Change Password: This will create a new password if you forget password.
  changePassword(changePasswordForm: NgForm): Promise<any> { //using
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
  sendVerificationCode(emailID: any): Promise<any> { // using
    let email = emailID.form ? emailID.form.value.email : emailID.value;
    return Auth.forgotPassword(email)
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
  }

  getVC(email,password): Promise<any> { // using
    return Auth.signUp(
      {
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value
        }
      }
    )
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
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

  // loginUser(creds) {
  //   // We check if app runs with backend mode
  //   if (!this.config.isBackend) {
  //     this.receiveToken('token');
  //   } else {
  //     this.requestLogin();
  //     if (creds.social) {
  //       // tslint:disable-next-line
  //       window.location.href = this.config.baseURLApi + '/user/signin/' + creds.social + (process.env.NODE_ENV === 'production' ? '?app=light-blue/angular' : '');
  //     } else if (creds.email.length > 0 && creds.password.length > 0) {
  //       this.http.post('/user/signin/local', creds).subscribe((res: any) => {
  //         const token = res.token;
  //         this.receiveToken(token);
  //       }, err => {
  //         this.loginError(err.response.data);
  //       });

  //     } else {
  //       this.loginError('Something was wrong. Try again');
  //     }
  //   }
  // }

  // receiveToken(token) {
  //   let user: any = {};
  //   // We check if app runs with backend mode
  //   if (this.config.isBackend) {
  //     user = jwt.decodeToken(token).user;
  //     delete user.id;
  //   } else {
  //     user = {
  //       email: this.config.auth.email
  //     };
  //   }

  //   localStorage.setItem('token', token);
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.receiveLogin();
  // }

  // logoutUser() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //   this.router.navigate(['/login']);
  // }
}
