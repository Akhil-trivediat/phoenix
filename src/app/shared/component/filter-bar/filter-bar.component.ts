import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {

  selectedSensor: any;
  selectedYAxis: any;

  @Input() ngSelectItemsforComparision: any = [];
  @Input() ngSelectItemsforYaxis: any = [];
  @Output() dateTimeChangeEvent = new EventEmitter;
  @Output() ngSelectChangeEvent = new EventEmitter;
  @Output() ngSelectAddEvent = new EventEmitter;
  @Output() ngSelectRemoveEvent = new EventEmitter;
  @Output() ngSelectClearEvent = new EventEmitter;

  constructor() { }

  ngOnInit() { }

  onDateTimeChange($event) {
    this.dateTimeChangeEvent.emit($event);
  }

  onNgSelectChange($event) {
    this.ngSelectChangeEvent.emit($event);
  }

  onNgSelectAdd($event) {
    this.ngSelectAddEvent.emit($event); 
  }

  onNgSelectRemove($event) {
    this.ngSelectRemoveEvent.emit($event);
  }

  onNgSelectClear($event) {
    this.ngSelectClearEvent.emit($event);
  }

}
