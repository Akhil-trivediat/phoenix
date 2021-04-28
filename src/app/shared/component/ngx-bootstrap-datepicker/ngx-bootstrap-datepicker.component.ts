import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ngx-bootstrap-datepicker',
  templateUrl: './ngx-bootstrap-datepicker.component.html',
  styleUrls: ['./ngx-bootstrap-datepicker.component.css']
})
export class NgxBootstrapDatepickerComponent implements OnInit  {

  startDateTime: Date = new Date();
  endDateTime: Date = new Date();
  maxEndDate: Date = new Date();
  maxStartDate: Date = new Date();
  minEndDate: Date;
  datetimepickerForm: any;
  
  @Output() onDateTimeChange = new EventEmitter;
  
  constructor(
    
  ) { }

  ngOnInit() {
    // this.datetimepickerForm = new FormGroup({
    //   stdt: new FormControl({value: ''})
    // });
    this.startDateTime.setDate(this.startDateTime.getDate() - 1);
  }

  onStartDateChange(newDate: Date) {
    this.startDateTime = newDate;
    this.minEndDate = newDate;
  }

  onEndDateChange(newDate: Date) {
    this.endDateTime = newDate;
  }

  onSaveBtnClicked() {
    let $event = [this.startDateTime, this.endDateTime];
    this.onDateTimeChange.emit($event);
  }
}
