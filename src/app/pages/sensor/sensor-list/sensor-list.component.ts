import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  emptyRowObj: any = {
    name: "",
    id: "",
    product: ""
  };
  constructor() { }
  sensorsArray = [];

  ngOnInit() {
    this.getSensorList();
  }

  getSensorList() {
    this.sensorsArray = [
      {
        name : "Sensor 1",
        id : "1000",
        product : "Product A"
      },
      {
        name : "Sensor 2",
        id : "2000",
        product : "Product B"
      },
      {
        name : "Sensor 3",
        id : "3000",
        product : "Product C"
      }
    ];
  }

}
