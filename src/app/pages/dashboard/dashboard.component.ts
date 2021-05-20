import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { Router} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { PubsubService } from '../../shared/service/pubsub.service';
import { RequesterService } from '../../shared/service/requester.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import * as Highcharts from 'highcharts';

declare var jQuery: any;
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {



  // options = [
  //   { id: 1, label: 'One' },
  //   { id: 2, label: 'Two' },
  //   { id: 3, label: 'Three' },
  //   { id: 4, label: 'Four' }
  // ];
  control = new FormControl();
  status: string;
  username: string;
  location: string;
  totalGatewayCount: any = "0";
  activeGatewayCount: any = "0";
  totalSensorCount: any = "0";
  activeSensorCount: any = "0";
  statusFilter: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private router: Router,
    private spinner: NgxSpinnerService,
    private pubsubService: PubsubService,
    private requesterService: RequesterService,
  ) {
    this.subscribetoMQTT();
  }



  ngOnInit() {
    this.spinner.show();
    this.getUserDetails();
    this.getAllGateways();
    this.getAllSensors();
    this.prepareVectorMap();
    // this.prepareDonutChart();
   // this.prepareHighChartDonutChart();
  }

  ngAfterViewInit(){
    //jQuery('#world-map').vectorMap();
    //document.querySelector('#world-map').vectorMap();
  }

  prepareHighChartDonutChart() {

    new Highcharts.Chart({
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      },
      chart: {
          renderTo: 'highchart-donutchart',
          type: 'pie',
          backgroundColor: '#293647',
          plotBorderWidth: null,
          plotShadow: false,
          margin: [0,0,0,0],
          spacingTop: 0,
          spacingBottom: 0,
          spacingLeft: 0,
          spacingRight: 0
      },
      title: {
          text: null
      },
      yAxis: {
        title: {
          text: null
        },
        minPadding: 0,
        maxPadding: 0
      },
      xAxis: {
        minPadding: 0,
        maxPadding: 0
      },
      plotOptions: {
          pie: {
            shadow: false,
            size: 120,
            center: ['50%', '50%']
          }
      },
      tooltip: {
          formatter: function() {
              return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
          }
      },
      series: [{
        name: 'Browsers',
        type:undefined,
        // data: [["Firefox",6],["MSIE",4],["Chrome",7]],
        data: [{
            name: 'one',
            y: 40,
            color: '#61D85E'
          },
          {
            name: 'two',
            y: 50,
            color: '#FF8253'
          }],
        size: '100%',
        innerSize: '50%',
        showInLegend: true,
        dataLabels: {
          enabled: false
        }
      }],
      legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'top',
        x: 40,
        y: 0
      },
      credits: {
        enabled: false
      }
    });
  }

  prepareDonutChart() {

    var chart = am4core.create("donutchart", am4charts.PieChart);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";

    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(50);
    pieSeries.colors.list = [
      am4core.color('#5392ff'),
      am4core.color('#95d13c'),
      am4core.color('#fe8500'),
      am4core.color('#FFD65A'),
      am4core.color('#8FF58C'),
      am4core.color('#00D4F4'),
      am4core.color('#9b82f3'),
      am4core.color('#34bc6e'),
      am4core.color('#FC585C'),
      am4core.color('#00E9C1'),
      am4core.color('#FFB15A'),
      am4core.color('#00CBDF')
    ];

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.hidden = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    //chart.legend = new am4charts.Legend();

    chart.data = [{
      "country": "Online",
      "litres": 10
    }, {
      "country": "Offline",
      "litres": 2
    }];

  }

  prepareVectorMap() {
    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Include US
    polygonSeries.include = ["US","CA"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;
    polygonTemplate.fill = am4core.color("rgb(121, 136, 146)"); //#798892 #d2d2d2
    polygonSeries.fill = am4core.color("rgb(121, 136, 146)");
    polygonTemplate.stroke = am4core.color("rgb(41, 54, 71)"); //#293647


    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("rgb(41, 50, 58)"); //#222D3C

    // Add image series
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipText = "{title}";
    imageSeries.mapImages.template.propertyFields.url = "url";

    let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 5;
    circle.strokeWidth = 2;
    circle.fill = am4core.color("rgb(255, 194, 71)");
    circle.stroke = am4core.color("rgb(255, 255, 255)");

    //circle.propertyFields.fill = "color";

    circle.nonScaling = true;

    let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 5;
    circle2.strokeWidth = 2;
    circle2.fill = am4core.color("rgb(255, 194, 71)");
    circle2.stroke = am4core.color("rgb(255, 255, 255)");


    circle2.events.on("inited", function(event){
      //animateBullet(event.target);
    })

    function animateBullet(circle) {
      let animation = circle.animate([{ property: "scale", from: 1 / chart.zoomLevel, to: 5 / chart.zoomLevel }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
      animation.events.on("animationended", function(event){
        animateBullet(event.target.object);
      })
    }

    let colorSet = new am4core.ColorSet();

    imageSeries.data = [
    {
      "title": "Boston",
      "latitude": 42.364506,
      "longitude": -71.038887
    },
    {
      "title": "Toronto",
      "latitude": 43.651070,
      "longitude": -79.347015
    },
    {
      "title": "New York",
      "latitude": 40.730610,
      "longitude": -73.935242
    },
    {
      "title": "Los Angeles",
      "latitude": 34.052235,
      "longitude": -118.243683
    },
    {
      "title": "Ottawa",
      "latitude": 45.334904,
      "longitude": -75.724098
    },
    {
      "title": "San Francisco",
      "latitude": 37.733795,
      "longitude": -122.446747
    },
    {
      "title": "Ohio",
      "latitude": 40.001633,
      "longitude": -83.019707
    },
    // {
    //   "title": "Brussels",
    //   "latitude": 50.8371,
    //   "longitude": 4.3676,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Copenhagen",
    //   "latitude": 55.6763,
    //   "longitude": 12.5681,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Paris",
    //   "latitude": 48.8567,
    //   "longitude": 2.3510,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Reykjavik",
    //   "latitude": 64.1353,
    //   "longitude": -21.8952,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Moscow",
    //   "latitude": 55.7558,
    //   "longitude": 37.6176,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Madrid",
    //   "latitude": 40.4167,
    //   "longitude": -3.7033,
    //   "color":colorSet.next()
    // }, {
    //   "title": "London",
    //   "latitude": 51.5002,
    //   "longitude": -0.1262,
    //   "url": "http://www.google.co.uk",
    //   "color":colorSet.next()
    // }, {
    //   "title": "Peking",
    //   "latitude": 39.9056,
    //   "longitude": 116.3958,
    //   "color":colorSet.next()
    // }, {
    //   "title": "New Delhi",
    //   "latitude": 28.6353,
    //   "longitude": 77.2250,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Tokyo",
    //   "latitude": 35.6785,
    //   "longitude": 139.6823,
    //   "url": "http://www.google.co.jp",
    //   "color":colorSet.next()
    // }, {
    //   "title": "Ankara",
    //   "latitude": 39.9439,
    //   "longitude": 32.8560,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Buenos Aires",
    //   "latitude": -34.6118,
    //   "longitude": -58.4173,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Brasilia",
    //   "latitude": -15.7801,
    //   "longitude": -47.9292,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Ottawa",
    //   "latitude": 45.4235,
    //   "longitude": -75.6979,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Washington",
    //   "latitude": 38.8921,
    //   "longitude": -77.0241,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Kinshasa",
    //   "latitude": -4.3369,
    //   "longitude": 15.3271,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Cairo",
    //   "latitude": 30.0571,
    //   "longitude": 31.2272,
    //   "color":colorSet.next()
    // }, {
    //   "title": "Pretoria",
    //   "latitude": -25.7463,
    //   "longitude": 28.1876,
    //   "color":colorSet.next()
    // }
  ];



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
    const email = this.username;
    this.requesterService.getRequest("/location" + "?email=" + email).subscribe(
        (response) => {
            this.setLocation(response[0] ? response[0].state : "");
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
        this.publishtoMQTTforGateway(gatewaysList);
        this.totalGatewayCount = gatewaysList.length;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  publishtoMQTTforGateway(gatewayList: any) {
    gatewayList.forEach((gateway: any) => {
      this.publishtoMQTT(gateway.id);
    });
  }

  getActiveGatewayCount(data: any) {
    let activeGatewayCount: number = 0;
    if(data.value.aws_connection_status.toLocaleLowerCase() === "connected") {
      activeGatewayCount++;
    }
    this.activeGatewayCount = activeGatewayCount.toString();
    //console.log("count of active gateways", this.activeGatewayCount);
  }

  getAllSensors() {
    let email = this.username;
    let params = new HttpParams();
    params = params.append('email', this.username);
    params = params.append('gatewayID', 'all');
    this.requesterService.getRequest("/sensor" + "?email=" + email + "&gatewayID=all").subscribe(
      (sensorList) => {
        this.totalSensorCount = sensorList.length;
        this.getActiveSensorCount(sensorList);
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  getActiveSensorCount(sensorList: any) {
    let activeSensorCount: number = 0;
    sensorList.forEach((sensor: any) => {
      if(sensor.status === "Online"){
        activeSensorCount++;
      }
    });
    this.activeSensorCount = activeSensorCount.toString();
  }

  // addDeviceNav(path: string){
  //   this.router.navigate([path]);
  // }

  onGoToDevicePage(path: string, deviceStatus: string) {
    if(deviceStatus != '') {
      this.router.navigate([path], {queryParams: {status: deviceStatus}});
    }
    else{
      this.router.navigate([path]);
    }
  }

  subscribetoMQTT() {
    this.pubsubService.subscribetoMQTT().subscribe(
      data => {
        this.getActiveGatewayCount(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  publishtoMQTT(gatewayID: string) {
    let deviceConfigJSON = {
      "clientId": gatewayID,
      "command": "CMD_INFO"
    }

    let IOTParams = {
      topic: gatewayID + "/config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
