import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { RouterModule, Routes } from '@angular/router';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { AlertModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponentModule } from '../../shared/component/alert/alert.module';
//import { AlertComponent } from '../../shared/component/alert/alert.component';

const routes: Routes = [{
  path: '',
  component: ForgotPasswordComponent
}];

@NgModule({
  declarations: [], //ForgotPasswordComponent
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WidgsterModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponentModule
  ]
})
export class ForgotPasswordModule { }
