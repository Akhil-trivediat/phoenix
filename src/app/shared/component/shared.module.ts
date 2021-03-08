import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDialogComponent } from './ngx-dialog/ngx-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormcontrolComponent } from './dynamic-form/dynamic-formcontrol/dynamic-formcontrol.component';

@NgModule({
  declarations: [ SpinnerComponent, NgxDialogComponent, DynamicFormComponent, DynamicFormcontrolComponent ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ModalModule,
    ReactiveFormsModule
  ],
  exports: [
    SpinnerComponent,
    NgxDialogComponent
  ]
})
export class SharedModule { }