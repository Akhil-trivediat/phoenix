import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap';
import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [AlertComponent],
  imports: [
    AlertModule,
    CommonModule
  ],
  exports: [
    AlertComponent
  ],
  providers: [
  ]
})
export class AlertComponentModule { }
