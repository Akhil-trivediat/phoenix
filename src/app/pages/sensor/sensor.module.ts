import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorDetailComponent } from './sensor-detail/sensor-detail.component';

const routes: Routes = [
  {
    path: '', component: SensorListComponent
  },
  {
    path: ':id', component: SensorDetailComponent
  }
];

@NgModule({
  declarations: [SensorListComponent, SensorDetailComponent],
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
export class SensorComponentModule { }
