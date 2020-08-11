import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrendModule } from 'ngx-trend';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { CalendarModule as AngularCalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SkyconsModule } from '../../components/skycon/skycon.module';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { UtilsModule } from '../../utils/utils-module/utils.module';
import { MainComponent } from './main.component';

export const routes = [
  // { path: '', redirectTo: 'visits', pathMatch: 'full' }
  { path: '', component: MainComponent}
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TrendModule,
    SkyconsModule,
    NgApexchartsModule,
    NgxEchartsModule,
    CountUpModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    WidgsterModule,
    ProgressbarModule,
    BsDropdownModule,
    UtilsModule
  ],
  providers: [
  ]
})
export class MainModule { }
