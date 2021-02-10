import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ngxVerticalBarChartData } from '../../utils/data/ngx-charts.data';
import { single, multi } from './data';
//import {BrowserDomAdapter} from '@angular/platform/browser'}

import { RequesterService } from '../../shared/service/requester.service';
import * as QuickSightEmbedding from '../../../../node_modules/amazon-quicksight-embedding-sdk';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() size: number = 51;
  dashboard: any;

  single: any[];
  multi: any[];

 //view: any[] = [600, 400];

  options;
//   showXAxis = true;
//  showYAxis = true;
//   gradient = false;
//   showLegend = true;
//   showXAxisLabel = true;
//   xAxisLabel = 'Sensor';
//   showYAxisLabel = true;
//   yAxisLabel = 'Temperature';

  showGraph: boolean = false;

  //myDOM: Object;
 // legendTitle: string = 'Years';

  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };

  username: string;
  location: string;
  gatewayCount: string;
  sensorCount: string;

  
  finalGraphData: any = [];

  constructor(
    private requesterService: RequesterService,
    private router: Router
  ) {
    this.getGraphData();
   // Object.assign(this, { single1 });
    Object.assign(this, { multi });
  }

  onSelect(event) {
    console.log(event);
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit() {
    
    this.getUserDetails();
    this.getAllGateways();
    this.getAllSensors();
    //this.loadDashboard();
    //this.getDashboardURL();
  }

  async getGraphData() {
    let graphData: any =[];
    await this.requesterService.getRequest('/graphdata').toPromise().then(
      response => {
        //console.log(response);
        response.forEach((data: any) =>{
          if (data.temp) {
            graphData.push({
              "name": data.sensorid,
              "value": data.temp
            });
          }
        });
        this.finalGraphData = graphData;
        this.showGraph = true;
        //this.myDOM = new BrowserDomAdapter();
      },
      error => {
        console.log(error);
      }
    );
  //   this.requesterService.getRequest('/account/graphdata').subscribe(
  //     (response) => {
  //         console.log(response);
  //         response.forEach((data) =>{
  //           this.single1.push({
  //             "name": data.sensorid,
  //             "value": data.temp
  //           });
  //         });
  //     },
  //     (error) => {
  //         console.log(error);
  //     }
  // );
    
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
    this.requesterService.getRequest('/location').subscribe(
        (response) => {
            this.setLocation(response[0].location);
        },
        (error) => {
            console.log(error);
        }
    );
  }

  getAllGateways() {
    this.requesterService.getRequest("/gateway").subscribe(
      (gatewaysList) => {
        this.gatewayCount = gatewaysList.length;
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getAllSensors() {
    this.requesterService.getRequest("/sensor").subscribe(
      (sensorList) => {
        this.sensorCount = sensorList.length;
      },
      (error) => {
        console.log("error");
      }
    );
  }

  addDeviceNav(){
    this.router.navigate(["registerDevice"]);
  }


  
  loadDashboard() {
    this.requesterService.getDashboardUrl("/dashboard/getDashboardUrl","suryasnata@trivediat.com").subscribe(
      url => {
        console.log(url['payload'].EmbedUrl);
        const embedUrl = url['payload'].EmbedUrl;
        const options = {
          url: embedUrl,
          container: document.getElementById('dashboardContainer'),
          parameters: {
            country: 'Ecuador'
          },
          scrolling: 'no',
          height: 'AutoFit',
          width: '100%'
        };
        const dashboard = QuickSightEmbedding.embedDashboard(options);
         dashboard.on('error', this.onError1);
         dashboard.on('load', this.onDashboardLoad1);
      }
    );
  }

  onDashboardLoad1() {
    console.log("Dashboard Loaded");
  }

  onError1() {
    console.log("Dashboard error");
  }

  // getDashboardURL() {
  //   this.requesterService.getDashboardUrl("/dashboard/getDashboardUrl","suryasnata@trivediat.com").subscribe(
  //     (data) => {
  //       let url = data["url"];
  //       this.loadDashboard(url);
  //     }
  //   );
  // }

  // loadDashboard(embeddedURL: string) {
  //   var containerDiv = document.getElementById("dashboardContainer");
  //   var options = { 
  //     url: embeddedURL, 
  //     container: containerDiv, 
  //     scrolling: "no", 
  //     height: "AutoFit", 
  //     width: "100%" 
  //   }; 
  //   this.dashboard = QuickSightEmbedding.embedDashboard(options);
  //   this.dashboard.on('load',this.onDashboardLoad);
  //   this.dashboard.on('error',this.onError);
  // }

  // onDashboardLoad(payLoad) { 
  //   console.log("Do something when the dashboard is fully loaded."); 
  // }

  // onError() {
  //   console.log("Dashboard error");
  // }

}
