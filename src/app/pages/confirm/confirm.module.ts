import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm.component';
import { RouterModule, Routes } from '@angular/router';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { AlertModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  component: ConfirmComponent
}];

@NgModule({
  declarations: [ConfirmComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WidgsterModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfirmModule { }
