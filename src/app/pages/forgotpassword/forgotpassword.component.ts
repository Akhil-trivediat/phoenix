import {Component, HostBinding, OnInit} from '@angular/core';
import {Auth} from 'aws-amplify';
import {FormBuilder, FormGroup, NgForm, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import { Location } from '@angular/common';
import { LoginService } from '../login/login.service';
import { NotificationService } from '../../shared/service/notification.service';

const fb = new FormBuilder();
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @HostBinding('class') classes = 'auth-page app';
  public formGroup: FormGroup = fb.group({
    username: ''
  })
  errorMessage: string;
  isFetching = false;
  bShowChangePwdForm: boolean = false;
  showAlert = false;
  emailValue: string;

  constructor(
    private router: Router,
    private location: Location,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    
  }

  onCancelBtnClick() {
    this.location.back();
  }

  submitemail(forgotPasswordForm: NgForm) {
    this.isFetching = true;
    this.emailValue = forgotPasswordForm.form.value.email;
    this.loginService.sendVerificationCode(forgotPasswordForm).then(
      response => {
        this.isFetching = false;
        this.bShowChangePwdForm = true;
      },
      err => {
        this.isFetching = false;
        this.errorMessage = err;
      }
    );
  }

  onChangePassword(changePasswordForm: NgForm) {
    this.showAlert = false;
    this.loginService.changePassword(changePasswordForm).then(
      (response) => {
        this.showAlert = true;
        this.notificationService.success(response.message);
        this.router.navigate(['/login']);
      },
      (err) => {
        this.showAlert = true;
        this.notificationService.error(err.message);
      }
    );
  }

  onResendVerificationCode() {
    this.bShowChangePwdForm = false;
  }
}
