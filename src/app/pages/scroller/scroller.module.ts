import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerComponent } from './scroller.component';
import { RouterModule, Route } from '@angular/router';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { FactsDataSource } from './facts.datasource';
import { FactService } from './fact.service';
import { WidgsterModule } from '../../components/widgster/widgster.module';

const routes: Route[] = [{
  path: '',
  component: ScrollerComponent
}];


@NgModule({
  declarations: [ScrollerComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ScrollingModule,
    WidgsterModule
  ],
  providers: [
    FactsDataSource,
    FactService
  ]
})
export class ScrollerModule { }
