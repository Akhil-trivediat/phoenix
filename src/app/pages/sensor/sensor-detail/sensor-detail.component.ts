import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';
import { data, goog, msft, aapl } from './sampleGraphData';
import { ColumnMode } from "@swimlane/ngx-datatable";
import * as Highcharts from 'highcharts/highstock';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.css']
})
export class SensorDetailComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  private subscription: any;
  public options: any;
  sensorid: string;
  sensorDetailsForm:  any;
  addSensorForm: any;
  isOnline: boolean = false;
  sensorDataTable: any = [];
  graphData: any =[];
  names: any = ['MSFT', 'AAPL', 'GOOG'];
  multipleSeriesOptions: any = [];
  selectedSensor: any;
  ddSensorsList: Array<Object>;
  sensorModel: any;
  aSensorsSelectedforGraph: any = [];
  sSensorsSelectedforGraph: string;

  constructor(
    private route: ActivatedRoute,
    private requesterService: RequesterService,
    private spinner: NgxSpinnerService
  ) { 
    this.subscription = this.route.params.subscribe(params => {
      this.sensorid = params['id'];
    });
    //this.prepareStockChartDemo(); 
  }
  
  ngOnInit() {
    this.spinner.show();
    this.getSensorList();
    this.loadGraph();
    this.prepareForm();
    this.getSensorDetails();
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getSensorList() {
    let sensorArray = [];
    let params = new HttpParams();
    params = params.append('email', this.getUserDetails());
    params = params.append('gatewayID', 'all');

    this.requesterService.getRequestParams("/sensor", params).subscribe(
      (sensorsList) => {
        sensorsList.forEach((sensor: any) => {
          (sensorArray).push({
            id: sensor["id"]
          });
        });
        this.ddSensorsList = sensorArray;
        this.ddSensorsList = this.ddSensorsList.filter(item => item["id"] != this.sensorid);
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  sensorModelChange(){
    this.aSensorsSelectedforGraph.push(this.sensorModel);
    this.sSensorsSelectedforGraph = this.aSensorsSelectedforGraph.join(' , ');
    this.ddSensorsList = this.ddSensorsList.filter(item => item["id"] != this.sensorModel);
  }

  resetSensorsSelectedforGraph() {
    this.aSensorsSelectedforGraph = [];
    this.sSensorsSelectedforGraph = "";
  }

  async addSensortoGraph() {
    this.spinner.show();
    for(var i = 0; i < this.selectedSensor.length; i++ ) {
      let graphData: any = [];
      await this.requesterService.getGraphDataSyncRequest('/graphdata',{ ID: this.selectedSensor[i].id }).then(
        response => {
          response.forEach((data: any) =>{
            let timestamp = new Date(data.messagedate);
            if (data.rawvalue) {
              graphData.push([
                timestamp.getTime(),
                data.rawvalue
              ]);
            }
          });
          this.multipleSeriesOptions.push(
            {
              name: this.selectedSensor[i].id,
              data: graphData
            }
          );
          if(i === this.selectedSensor.length - 1) {
            this.resetSensorsSelectedforGraph();
          }
          this.prepareStockChart(this.multipleSeriesOptions);
        },
        error => {
          console.log(error);
          this.resetSensorsSelectedforGraph();
          this.spinner.hide();
        }
      );
    }
  } 

  prepareStockChart(seriesOptions: any) {
    this.options = {
      rangeSelector: {
        selected: 4
      },
      title: {
        text: 'Temperature VS Time - Sensor Graph',
      },
      chart: {
        zoomType: 'xy',
        backgroundColor: {
          linearGradient: [0, 0, 500, 500],
          stops: [
              [0, 'rgb(255, 255, 255)'],
              [1, 'rgb(200, 200, 255)']
          ]
        },
        type: 'line'
      },
      xAxis: {
        title: {
          enabled: true,
          text: 'Time',
          align: 'middle',
          style: {
            fontWeight: 'normal',
            color: 'black'
          }
        }
      },
      yAxis: {
        tickPositioner: function () {
          var minTick = Math.ceil(this.dataMin / 10) * 10;
          var maxTick = Math.ceil(this.dataMax / 10) * 10;
          var tickStart = minTick - 20;
          var tickEnd = maxTick + 20;

          var positions = [];
          for(var i = tickStart ; i <= tickEnd ; i++) {
            if(i%10 == 0) {
              positions.push(i);
            }
          }
          return positions;
        },
        tickInterval: 10,
        opposite: false,
        labels: {
          formatter: function () {
            return (this.value > 0 ? ' + ' : '') + this.value;
          },
          align: 'left',
          rotation:0,
          y: 5,
          x: -30
        },
        gridLineColor: 'grey',
        title: {
          enabled: true,
          text: 'Temperature (°C)',
          align: 'middle',
          style: {
            fontWeight: 'normal'
          },
          margin: 40
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 2,
        changeDecimals: 2,
        split: true
      },
      series: seriesOptions
    };
    Highcharts.stockChart('highChart', this.options);
    this.spinner.hide();
  }

  prepareForm() {
    this.sensorDetailsForm = new FormGroup({
      sensorName: new FormControl({value: '', disabled: true}, [Validators.required]),
      readingValue: new FormControl({value: '', disabled: true}, [Validators.required]),
      readingUnit: new FormControl({value: '', disabled: true}, [Validators.required]),
      lastCommDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      location: new FormControl({value: '', disabled: true}, [Validators.required]),
      gatewayName: new FormControl({value: '', disabled: true}, [Validators.required]),
      minThres: new FormControl({value: '', disabled: true}, [Validators.required]),
      maxThres: new FormControl({value: '', disabled: true}, [Validators.required])
    }); 

    this.addSensorForm = new FormGroup({
      sensorID: new FormControl('')
    });
  }

  fillFormData(sensorData: any) {
    if(sensorData) {
      let date_ob = new Date(sensorData.lastCommDate);
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let lastCommDate = month + "-" + date + "-" + year;
      this.sensorDetailsForm.patchValue({
        sensorName: sensorData.sensorname,
        readingValue: parseFloat(sensorData.readingValue).toFixed(2),
        readingUnit: sensorData.readingUnit,
        lastCommDate: lastCommDate,
        location: '',
        gatewayName: sensorData.gatewayname,
        minThres: '',
        maxThres: ''
      });
    }
  }

  getSensorDetails() {
    this.requesterService.getRequest('/sensor/details' + '?id=' + this.sensorid).subscribe(
      (response) => {
        var sensorData = response[0];
        this.setSensorStatus(sensorData.status);
        this.fillFormData(sensorData);
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  setSensorStatus(status: string) {
    if(status === "Online") {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
  }

  loadGraph() {
    let sensorDataTableRows: any = [];
    this.requesterService.getGraphRequest('/graphdata',{ID: this.sensorid}).subscribe(
      response => {
        response.forEach((data: any) =>{
          let timestamp = new Date(data.messagedate);
          if (data.rawvalue) {
            this.graphData.push([
              timestamp.getTime(),
              +parseFloat(data.rawvalue).toFixed(2)
            ]);
            sensorDataTableRows.push({
              'timestamp' : timestamp.toLocaleString(),
              'temperature' : parseFloat(data.rawvalue).toFixed(2)
            });

            //parseFloat(data.rawvalue).toFixed(2)
          }
        });
        this.setSensorDataTable(sensorDataTableRows);
        this.multipleSeriesOptions.push(
          {
            name: this.sensorid,
            data: this.graphData
          }
        );
        this.prepareStockChart(this.multipleSeriesOptions);
      },
      error => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  setSensorDataTable(data: any) {
    this.sensorDataTable = data;
    this.spinner.hide();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  prepareStockChartDemo() {
    this.options = {
      rangeSelector: {
        selected: 4
      },
      yAxis: {
        labels: {
          formatter: function () {
            return (this.value > 0 ? ' + ' : '') + this.value + '%';
          }
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },
      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
      },
      series: [
        {
          name: 'goog',
          data: goog
        },
        {
          name: 'msft',
          data: msft
        },
        {
          name: 'aapl',
          data: aapl
        },
      ]
    };
    Highcharts.stockChart('highChartDemo', this.options);
  }
}
