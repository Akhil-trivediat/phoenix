import { Component, OnInit } from '@angular/core';
import { ngxVerticalBarChartData } from '../../utils/data/ngx-charts.data';
import { single, multi } from './data';

import { RequesterService } from '../../shared/service/requester.service';
import * as QuickSightEmbedding from '../../../../node_modules/amazon-quicksight-embedding-sdk';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: any;

  single: any[];
  multi: any[];

  view: any[] = [600, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  legendTitle: string = 'Years';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private requesterService: RequesterService
  ) {
    Object.assign(this, { single });
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
    this.loadDashboard();
    //this.getDashboardURL();
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
