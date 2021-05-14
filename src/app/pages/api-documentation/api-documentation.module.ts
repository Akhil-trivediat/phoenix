import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { APIDocumentationComponent } from './api-documentation.component';


const routes: Routes = [
  {
    path: '', component: APIDocumentationComponent
  }
];

@NgModule({
  declarations: [APIDocumentationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ]
})
export class APIDocumentationModule { }
