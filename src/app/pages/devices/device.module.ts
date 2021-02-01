import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceRegistrationComponent } from './device-registration/device-registration.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DeviceComponent } from './device/device.component';

const routes: Routes = [
  {
    path: '', component: DeviceListComponent
  },
  {
    path: ':id', component: DeviceComponent
  },
  // {
  //   path: 'registerDevice', component: DeviceRegistrationComponent
  // }
];

@NgModule({
  declarations: [DeviceListComponent,DeviceRegistrationComponent, DeviceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  providers: [
  ]
})
export class DevicesComponentModule { }
