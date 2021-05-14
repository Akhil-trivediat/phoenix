import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AIInsightsReportsComponent } from './ai-insights-reports.component';


const routes: Routes = [
  {
    path: '', component: AIInsightsReportsComponent
  }
];

@NgModule({
  declarations: [AIInsightsReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ]
})
export class AIInsightsReportsModule { }
