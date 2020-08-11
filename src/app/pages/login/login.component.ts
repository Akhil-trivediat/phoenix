import { Component, OnInit, HostBinding } from '@angular/core';
import {LoginService} from './login.service';
import {Auth} from 'aws-amplify';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';

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
  constructor(public loginService: LoginService, private appService: AppService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    console.log('clicked login');
    Auth.signIn(this.formGroup.get('username').value, this.formGroup.get('password').value).then((result) => {
      if (result) {
        AppService.saveToken(result);
        AppService.setLogin(true);
        this.router.navigate(['app/main']);
      }
    }).catch(error => {
      console.log(error);
    });
  }

}
