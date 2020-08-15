import { Component, OnInit, HostBinding } from '@angular/core';
import { FactsDataSource } from './facts.datasource';
import { FactService } from './fact.service';

export interface Fact {
  text?: string;
  date?: string;
}

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss']
})
export class ScrollerComponent implements OnInit {
  @HostBinding('class') classes = 'auth-page app';
  public dataSource: FactsDataSource;

  constructor(private factService: FactService) {
    this.dataSource = new FactsDataSource(factService);
  }

  ngOnInit() {
    console.log(this.dataSource);
  }
}
