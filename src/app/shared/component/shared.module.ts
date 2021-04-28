import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SpinnerComponent } from './spinner/spinner.component'
import { NgxDialogComponent } from './ngx-dialog/ngx-dialog.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormcontrolComponent } from './dynamic-form/dynamic-formcontrol/dynamic-formcontrol.component';
import { NgxBootstrapDatepickerComponent } from './ngx-bootstrap-datepicker/ngx-bootstrap-datepicker.component';


@NgModule({
  declarations: [ SpinnerComponent, NgxDialogComponent, DynamicFormComponent, DynamicFormcontrolComponent, NgxBootstrapDatepickerComponent ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  exports: [
    SpinnerComponent,
    NgxDialogComponent,
    NgxBootstrapDatepickerComponent,
  ]
})
export class SharedModule { }