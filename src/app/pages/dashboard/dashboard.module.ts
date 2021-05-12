import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgsterModule } from '../../components/widgster/widgster.module';
import { LoaderModule } from '../../components/loader/loader.module'
import { DashboardComponent } from './dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/component/shared.module';

import { AutocompleteInputBarComponent } from './autocomplete-input-bar/autocomplete-input-bar.component';
import { FilterPipe } from './autocomplete-input-bar/filter.pipe';
import { AutocompleteDirective } from './autocomplete-input-bar/autocomplete.directive';
import { AutocompleteContentDirective } from './autocomplete-input-bar/autocomplete-content.directive';
import { AutocompleteOptionComponent } from './autocomplete-input-bar/autocomplete-option/autocomplete-option.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    FilterPipe, 
    AutocompleteInputBarComponent,
    AutocompleteDirective,
    AutocompleteContentDirective,
    AutocompleteOptionComponent 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    WidgsterModule,
    LoaderModule,
    NgxChartsModule,
    SharedModule,
  ],
  providers: [
  ],
  exports: [
    AutocompleteInputBarComponent,
    AutocompleteDirective,
    AutocompleteContentDirective,
    AutocompleteOptionComponent
  ]  //entryComponents:[ AutocompleteInputBarComponent ]
})
export class DashboardComponentModule { }
