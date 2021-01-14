import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRegistrationComponent } from './account-registration.component';
import { RouterModule, Routes } from '@angular/router';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  component: AccountRegistrationComponent
}];

@NgModule({
  declarations: [AccountRegistrationComponent],
  imports: [
    AmplifyAngularModule,
    CommonModule,
    RouterModule.forChild(routes),
    WidgsterModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AmplifyService
  ]
})
export class AccountRegistrationModule { }
