import { Component, OnInit, HostBinding } from '@angular/core';
import {Auth} from 'aws-amplify';
import {FormBuilder, FormGroup} from '@angular/forms';
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

  bShowErrorMessage: boolean = false;

  constructor(
    public loginService: LoginService,
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  login() {
    const username = this.formGroup.get('username').value;
    const password = this.formGroup.get('password').value;

    this.authService.login(username, password);

    //this.loginService.logIn(username, password);
  }
}
