import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import {PopoverModule} from "ngx-bootstrap";
import { DialogComponent } from './dialog/dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';


const routes: Route[] = [{
  path: '',
  component: UsersComponent
}];
@NgModule({
  declarations: [UsersComponent,DialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    PopoverModule,
    ModalModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
