import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModule } from 'ngx-bootstrap';
import { AlertComponentModule } from '../../shared/component/alert/alert.module';
import { GatewaysListComponent } from './gateways-list/gateways-list.component';
import { GatewayDetailComponent } from './gateway-detail/gateway-detail.component';
import { GatewayRegistrationComponent } from './gateway-registration/gateway-registration.component';
import { AssignSensorComponent } from './assign-sensor/assign-sensor.component';
import { SharedModule } from '../../shared/component/shared.module';

const routes: Routes = [
  {
    path: '', component: GatewaysListComponent
  },
  {
    path: 'addGateway', component: GatewayRegistrationComponent
  },
  {
    path: ':id/assignSensor', component: AssignSensorComponent
  },
  {
    path: 'id/:id', component: GatewayDetailComponent
  }
];

@NgModule({
  declarations: [GatewaysListComponent, GatewayDetailComponent, GatewayRegistrationComponent, AssignSensorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TabsModule,
    NgSelectModule,
    AlertComponentModule,
    AlertModule,
    SharedModule
  ],
  providers: [
  ]
})
export class GatewayComponentModule { }
