import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Sensor } from '../../../models/commonmodel.data';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;

  constructor(
    private requesterService: RequesterService
  ) { }
  sensorsArray = [];

  ngOnInit() {
    this.getSensorList();
  }

  getSensorList() {
    let sensorArray = [];
    this.requesterService.getRequest("/sensor").subscribe(
      (sensorsList) => {
        this.sensorsArray = sensorsList;
        sensorsList.forEach((sensor: Array<Sensor>) => {
          (sensorArray as Array<Sensor>).push({
            'sensorName': sensor["sensorName"],
            'sensorid': sensor["sensorid"],
            'status': sensor["status"],
            'gateway': sensor["gateway"],
            'activationdate': sensor["activationdate"],
            'lastconnected': sensor["lastconnected"]
          });
        });
        this.sensorsArray = sensorArray;
      },
      (error) => {
        console.log("error");
      }
    );
  }
}
