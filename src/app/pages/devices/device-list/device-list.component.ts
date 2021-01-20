import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Router } from '@angular/router'

@Component({
  selector: 'app-devices',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  emptyRowObj: any = {
    name: "",
    id: "",
    product: ""
  };
  constructor(
    private router: Router
  ) { }
  deviceArray = [];

  ngOnInit() {
    this.getDeviceList();
  }

  getDeviceList() {
    this.deviceArray = [
      {
        name : "Device 1",
        id : "1000",
        product : "Product A"
      },
      {
        name : "Device 2",
        id : "2000",
        product : "Product B"
      },
      {
        name : "Device 3",
        id : "3000",
        product : "Product C"
      }
    ];
  }

  addDeviceNav(){
    this.router.navigate(["/app/registerDevice"]);
  }

}
