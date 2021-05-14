import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorDetailComponent } from './sensor-detail/sensor-detail.component';
import { SensorRegistrationComponent } from './sensor-registration/sensor-registration.component';
import { AssignGatewayComponent } from './assign-gateway/assign-gateway.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/component/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Angular2CsvModule } from 'angular2-csv';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import {TooltipModule} from "ngx-bootstrap";

const routes: Routes = [
  {
    path: '', component: SensorListComponent
  },
  {
    path: 'addSensor', component: SensorRegistrationComponent
  },
  {
    path: ':id/assignGateway', component: AssignGatewayComponent
  },
  {
    path: 'id/:id', component: SensorDetailComponent
  }
];

@NgModule({
  declarations: [
    SensorListComponent,
    SensorDetailComponent,
    SensorRegistrationComponent,
    AssignGatewayComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        TabsModule,
        NgxChartsModule,
        WidgsterModule,
        NgSelectModule,
        SharedModule,
        ModalModule,
        Angular2CsvModule,
        // BrowserAnimationsModule,
        CollapseModule.forRoot(),
        TooltipModule
    ],
  providers: [
  ]
})
export class SensorComponentModule { }
