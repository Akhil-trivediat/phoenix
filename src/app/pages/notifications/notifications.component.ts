import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  rows = [];
  loadingIndicator = true;
  reorderable = true;
  columns = [
    { name: 'Sensor Name', prop: 'sensorname' }, 
    { name: 'Location', prop: 'location' }, 
    { name: 'Alert type', prop: 'alerttype' },
    { name: 'Value', prop: 'value' }
  ];

  public columnMode: typeof ColumnMode = ColumnMode;

  constructor() { }

  ngOnInit() {
    this.getNotificationList();
  }

  getNotificationList() {
    this.rows = [
      {
        "sensorname": "201070226",
        "location": "Boston",
        "alerttype": "Warning",
        "value": "30 °C"
      },
      {
        "sensorname": "024091097",
        "location": "Toronto",
        "alerttype": "Warning",
        "value": "39 °C"
      },
      {
        "sensorname": "211080236",
        "location": "Boston",
        "alerttype": "Warning",
        "value": "45 °C"
      },
      {
        "sensorname": "099866123",
        "location": "Boston",
        "alerttype": "Warning",
        "value": "42 °C"
      }
    ];

    this.loadingIndicator = false;
  }

  sendNotificationToEmail() {
    
  }

}
