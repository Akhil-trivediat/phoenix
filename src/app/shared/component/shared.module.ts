import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DatepickerModule, BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { SpinnerComponent } from './spinner/spinner.component'
import { NgxDialogComponent } from './ngx-dialog/ngx-dialog.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormcontrolComponent } from './dynamic-form/dynamic-formcontrol/dynamic-formcontrol.component';
import { NgxBootstrapDatepickerComponent } from './ngx-bootstrap-datepicker/ngx-bootstrap-datepicker.component';
import { FilterbarModelComponent } from './filterbar-model/filterbar-model.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ 
    SpinnerComponent, 
    NgxDialogComponent, 
    DynamicFormComponent, 
    DynamicFormcontrolComponent, 
    NgxBootstrapDatepickerComponent, 
    FilterbarModelComponent, 
    FilterBarComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgSelectModule
  ],
  exports: [
    SpinnerComponent,
    NgxDialogComponent,
    NgxBootstrapDatepickerComponent,
    FilterbarModelComponent,
    FilterBarComponent
  ],
  providers: [ BsDatepickerConfig ],
})
export class SharedModule { }