import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';
import { AuthService } from '../../shared/service/auth.service';

const fb = new FormBuilder();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @HostBinding('class') classes = 'auth-page app';
  public formGroup: FormGroup = fb.group({
    username: '',
    password: ''
  })

  _errorMessage: string = '';
  _isFetching: boolean = false;

  constructor(
    public loginService: LoginService,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  get isFetching() {
    return this._isFetching;
  }

  set isFetching(val: boolean) {
    this._isFetching = val;
  }

  receiveLogin() {
    this.isFetching = false;
    this.errorMessage = '';
  }

  requestLogin() {
    this.isFetching = true;
  }

  loginError(errorMessage: string) {
    this.isFetching = false;
    this.errorMessage = errorMessage;
  }

  login() {
    this.requestLogin();

    const username = this.formGroup.get('username').value;
    const password = this.formGroup.get('password').value;

    this.authService.login(username, password).then(
      response => {
        this.receiveLogin();
      }
    ).catch(
      error => {
        this.loginError(error.message);
      }
    );
  }
}
