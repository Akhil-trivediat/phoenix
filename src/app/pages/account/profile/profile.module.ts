import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../../components/loader/loader.module'
import { ProfileComponent } from './profile.component';

const routes: Route[] = [{
  path: '',
  component: ProfileComponent
}];


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class ProfileModule { }
