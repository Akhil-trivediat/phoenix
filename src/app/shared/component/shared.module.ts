import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AlertComponent } from './alert/alert.component';

// const routes: Routes = [{
//   path: '',
//   component: ResetPasswordComponent
// }];

@NgModule({
  declarations: [AlertComponent, ResetPasswordComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
