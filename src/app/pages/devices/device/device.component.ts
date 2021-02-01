import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  deviceid: number;
  private subscription: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.deviceid = +params['id'];
   });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
