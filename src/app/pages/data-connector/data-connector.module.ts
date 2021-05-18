import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DataConnectorComponent } from './data-connector.component';


const routes: Routes = [
  {
    path: '', component: DataConnectorComponent
  }
];

@NgModule({
  declarations: [DataConnectorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
  ],
  providers: [
  ]
})
export class DataConnectorModule { }
