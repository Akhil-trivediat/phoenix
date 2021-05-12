import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ngx-bootstrap-datepicker',
  templateUrl: './ngx-bootstrap-datepicker.component.html',
  styleUrls: ['./ngx-bootstrap-datepicker.component.css']
})
export class NgxBootstrapDatepickerComponent implements OnInit  {

  bsRangeValue: Date[];
  endRangeDate: Date = new Date();
  startRangeDate: Date = new Date();
  
  @Output() onDateTimeChange = new EventEmitter;
  
  constructor( ) { 
    this.startRangeDate.setDate(this.startRangeDate.getDate() - 1);
    this.bsRangeValue = [this.startRangeDate, this.endRangeDate];
  }

  onValueChange(event) {
    this.onDateTimeChange.emit(event);
  }

  ngOnInit() {
    
    //this.startDateTime.setDate(this.startDateTime.getDate() - 1);
  }

  // @Input() showDatepicker: boolean;
  // @Input() showTimepicker: boolean;
  // startDateTime: Date = new Date();
  // endDateTime: Date = new Date();
  // maxEndDate: Date = new Date();
  // maxStartDate: Date = new Date();
  // minEndDate: Date;
  // datetimepickerForm: any;

  // onSaveBtnClicked() {
  //   let $event = [this.startDateTime, this.endDateTime];
  //   this.onDateTimeChange.emit($event);
  // }

  // onStartDateChange(newDate: Date) {
  //   this.startDateTime = newDate;
  //   this.minEndDate = newDate;
  // }

  // onEndDateChange(newDate: Date) {
  //   this.endDateTime = newDate;
  // }

  
}
