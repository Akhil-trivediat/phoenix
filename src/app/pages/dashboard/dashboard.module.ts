import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { LoaderModule } from '../../components/loader/loader.module'
import { DashboardComponent } from './dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/component/shared.module';

const routes: Routes = [
  {
    path: '', component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    WidgsterModule,
    LoaderModule,
    NgxChartsModule,
    SharedModule
  ],
  providers: [
  ]
})
export class DashboardComponentModule { }
