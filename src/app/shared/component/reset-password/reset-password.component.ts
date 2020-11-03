import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { LoginService } from '../../../pages/login/login.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  oldPwd = new FormControl('');
  newPwd = new FormControl('');
  cnfPwd = new FormControl('');

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  showAlert = false;
  alertMessage: string;

  constructor(
    private location: Location,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  onCancelBtnClick() {
    this.location.back();
  }

  onResetPassword(resetForm: NgForm) {
    this.showAlert = false;
    this.loginService.resetPassword(resetForm).then(
      (respose) => {
        resetForm.reset();
        this.showAlert = true;
        this.notificationService.success(respose);
      },
      (err) => {
        console.log(err);
        this.showAlert = true;
        this.notificationService.error(err.message);
      }
    );
    
  }
}
