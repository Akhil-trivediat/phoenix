import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { AppService } from '../../app.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Auth } from 'aws-amplify';
import { NgForm } from '@angular/forms';

const jwt = new JwtHelperService();

@Injectable()
export class LoginService {
  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';

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

  // Login Operations
  logIn(username: string, password: string) {
    Auth.signIn(username, password).then((result) => {
      if (result) {
        AppService.saveToken(result);
        AppService.setLogin(true);
        this.router.navigate(['app/main']);
      }
    }).catch(error => {
      console.log(error);
    });
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

  // Reset Password
  resetPassword(resetForm: NgForm): Promise<any> {
    var formDetails = resetForm.form.value;
    return Auth.currentAuthenticatedUser()
     .then(user => {
        return Auth.changePassword(user, formDetails.oldPassword, formDetails.newPassword);
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

  loginError(payload) {
    this.isFetching = false;
    this.errorMessage = payload;
  }

  receiveLogin() {
    this.isFetching = false;
    this.errorMessage = '';
    this.router.navigate(['/app/main/visits']);
  }

  requestLogin() {
    this.isFetching = true;
  }

  
}
