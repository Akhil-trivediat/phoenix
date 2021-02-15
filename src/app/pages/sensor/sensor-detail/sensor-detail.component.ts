import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';
import { data, goog, msft, aapl } from './sampleGraphData';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ColumnMode } from "@swimlane/ngx-datatable";
import * as Highcharts from 'highcharts/highstock';

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
  sensorid: number;
  private subscription: any;
  sensorDetailsForm:  any;
  addSensorForm: any;
  isOnline: boolean = false;
  showGraph: boolean = false;

  finalGraphData: any = [];
  sensorDetailArray: any = [];
  public options: any;

  graphData: any =[];
  //seriesOptions: any = []; 
  seriesCounter: any = 0;
  names: any = ['MSFT', 'AAPL', 'GOOG'];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private route: ActivatedRoute,
    private requesterService: RequesterService
  ) { 
    this.subscription = this.route.params.subscribe(params => {
      this.sensorid = +params['id'];
    });
    //this.getGraphData();
  }

  ngOnInit() {
    this.getGraphData();
    this.prepareForm();
   //this.prepareStockChart();

  //  this.dropdownList = [
  //   { item_id: 1, item_text: 'Mumbai' },
  //   { item_id: 2, item_text: 'Bangaluru' },
  //   { item_id: 3, item_text: 'Pune' },
  //   { item_id: 4, item_text: 'Navsari' },
  //   { item_id: 5, item_text: 'New Delhi' }
  // ];
  // this.selectedItems = [
  //   { item_id: 3, item_text: 'Pune' },
  //   { item_id: 4, item_text: 'Navsari' }
  // ];
  // this.dropdownSettings = {
  //   singleSelection: false,
  //   idField: 'item_id',
  //   textField: 'item_text',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true
  // };

  }

  // onItemSelect(item: any) {
  //   console.log(item);
  // }
  // onSelectAll(items: any) {
  //   console.log(items);
  // }

  prepareStockChart(seriesOptions: any) {
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
      series: seriesOptions
    };
    Highcharts.stockChart('highChart', this.options);
  }

  prepareGraph(graphData) {
    this.options = {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Sensor Graph'
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Timestamp'
        }
      },
      yAxis: {
        title: {
          text: 'Temperature'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [
        {
          type: 'area',
          name: 'myname',
          data: graphData
        } 
      ],
      tooltip: {
        formatter: function() {
          return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
          ' y: ' + this.y.toFixed(2);
        }
      }
    };
    Highcharts.stockChart('highChart', this.options);
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

  async getGraphData() {
    let sensorDetail: any = [];
    await this.requesterService.getGraphRequest('/graphdata',{ID: this.sensorid}).toPromise().then(
      response => {
        response.forEach((data: any) =>{
          var a = new Date(data.timestamp);
          if (data.temp) {
            this.graphData.push([
              a.getTime(),
              data.temp
            ]);
            sensorDetail.push({
              'timestamp' : a.getTime(),
              'temperature' : data.temp
            });
          }
        });
        this.finalGraphData = this.graphData;
        this.sensorDetailArray = sensorDetail;
        //this.prepareGraph(this.finalGraphData);
        let seriesOptions = [
          {
            name: this.sensorid,
            data: this.graphData
          }
        ];
        this.prepareStockChart(seriesOptions);
        this.showGraph = true;
      },
      error => {
        console.log(error);
      }
    );
  } 

  onSelect(event) {
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
