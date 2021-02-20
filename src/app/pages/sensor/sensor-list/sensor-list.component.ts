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
            'sensorName': sensor["name"],
            'sensorid': sensor["id"],
            'status': '',
            'gateway': sensor["gatewayname"],
            'activationdate': sensor["createddate"],
            'lastconnected': ''
          });
          // let date_ob = new Date(sensor["lastCommDate"]);
          // let date = ("0" + date_ob.getDate()).slice(-2);
          // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          // let year = date_ob.getFullYear();
          // let hours = ("00" + date_ob.getHours()).substr(-2);
          // let minutes = ("00" + date_ob.getMinutes()).substr(-2);
          // let seconds = ("00" + date_ob.getSeconds()).substr(-2);
          // let lastCommDate = year + "-" + month + "-" + date + ", " + hours + ":" + minutes + ":" + seconds;
          // (sensorArray as Array<Sensor>).push({
          //   'sensorName': sensor["sensorname"],
          //   'sensorid': sensor["sensorid"],
          //   'status': sensor["status"],
          //   'gateway': sensor["gatewayid"],
          //   'activationdate': sensor["activationdate"],
          //   'lastconnected': lastCommDate
          // });
        });
        this.sensorsArray = sensorArray;
      },
      (error) => {
        console.log("error");
      }
    );
  }

  onRefresh() {
    this.getSensorList();
  }
}
