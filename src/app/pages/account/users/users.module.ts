import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { UsersComponent } from './users.component';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {PopoverModule} from "ngx-bootstrap";


const routes: Route[] = [{
  path: '',
  component: UsersComponent
}];
@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    PopoverModule
  ]
})
export class UsersModule { }
