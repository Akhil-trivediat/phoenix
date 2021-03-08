import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { RequesterService } from '../../shared/service/requester.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string;
  location: string;
  gatewayCount: string;
  sensorCount: string;

  constructor(
    private requesterService: RequesterService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getUserDetails();
    this.getAllGateways();
    this.getAllSensors();
  }

  getUserDetails() {
    this.setUserName(localStorage.getItem('USER_NAME'));
    this.getLocation(localStorage.getItem('USER_NAME'));
  }

  setUserName(username: string): void {
    this.username = username;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  getLocation(username: string) {
    //let a = "suryasnata@trivediat.com";
    this.requesterService.getRequest("/location" + "?email=" + username).subscribe(
        (response) => {
            this.setLocation(response[0].state);
            this.spinner.hide();
        },
        (error) => {
            console.log(error);
            this.spinner.hide();
        }
    );
  }

  getAllGateways() {
    const email = this.username;
    //const email = "suryasnata@trivediat.com";
    this.requesterService.getRequest("/gateway" + "?email=" + email).subscribe(
      (gatewaysList) => {
        // if any data then show else hide
        this.gatewayCount = gatewaysList.length;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  getAllSensors() {
    let email = this.username;
    let params = new HttpParams();
    params = params.append('email', this.username);
    params = params.append('gatewayID', 'all');
    this.requesterService.getRequestParams("/sensor", params).subscribe(
      (sensorList) => {
        // if any data then show else hide
        this.sensorCount = sensorList.length;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  addDeviceNav(path: string){
    this.router.navigate([path]);
  }
}
