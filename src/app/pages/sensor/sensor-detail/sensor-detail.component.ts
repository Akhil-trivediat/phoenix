import { Component, OnInit, Inject, LOCALE_ID, TemplateRef   } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RequesterService } from '../../../shared/service/requester.service';
import { ColumnMode } from "@swimlane/ngx-datatable";
import * as Highcharts from 'highcharts/highstock';
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { FilterbarModelComponent } from '../../../shared/component/filterbar-model/filterbar-model.component';

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
  startdate: string = "";
  enddate:string = "";

  private $graph_textcolor = "#FFFFFF";
  private $graph_backgroundcolor = "#36455A";
  private $graph_gridlinecolor = "#1C2531";
  private $graph_seriescolor = "#61D85E";
  private $graph_threscolor = "#FF8252";
 
  downloadCSVoptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: true,
    title: ['Timestamp','Temperature'],
    useBom: false,
    removeNewLines: true,
    keys: ['timestamp','temperature']
  };
  downloadCSVdata = [];
  CSVfilename: string = "SensorReport.csv";

  modalRef: BsModalRef;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private route: ActivatedRoute,
    private requesterService: RequesterService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { 
    this.subscription = this.route.params.subscribe(params => {
      this.sensorid = params['id'];
    });
  }
  
  ngOnInit() {
    this.spinner.show();

    this.getSensorList();

    this.loadGraph(this.startdate, this.enddate, this.sensorid);

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

  onDateTimeChange(event) {
    this.startdate = event[0].toISOString();
    this.enddate = event[1].toISOString();

    this.loadGraph(this.startdate, this.enddate, this.sensorid);
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

      await this.requesterService.getGraphDataSyncRequest('/graphdata',
        { 
          ID: this.selectedSensor[i].id,
          startDate: "",
          endDate: ""
        }).then(
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
          this.multipleSeriesOptions = Array.from(this.multipleSeriesOptions.reduce((m, t) => m.set(t.name, t), new Map()).values());
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
      this.sensorDetailsForm.patchValue({
        sensorName: sensorData.sensorname,
        readingValue: parseFloat(sensorData.readingValue).toFixed(2),
        readingUnit: sensorData.readingUnit,
        lastCommDate: formatDate(sensorData.lastCommDate,'MM/dd/yyyy,HH:mm',this.locale),
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

  loadGraph(startdate,enddate,sensorid) {
    let sensorDataTableRows: any = [];
    this.multipleSeriesOptions = [];
    this.getGraphData(startdate,enddate,sensorid).subscribe(
      response => {
        response.forEach((data: any) =>{
          let timestamp = new Date(data.messagedate);
          if (data.rawvalue) {
            this.graphData.push([
              timestamp.getTime(),
              +parseFloat(data.rawvalue).toFixed(2)
            ]);
            sensorDataTableRows.push({
              'timestamp' : formatDate(timestamp,'MM/dd/yyyy,HH:mm',this.locale),
              'temperature' : parseFloat(data.rawvalue).toFixed(2)
            });
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
    this.prepareCSVReport(this.sensorDataTable);
    this.spinner.hide();
  }

  prepareCSVReport(data: any) {
    this.downloadCSVoptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      headers: [],
      showTitle: true,
      title: ['Timestamp','Temperature'],
      useBom: false,
      removeNewLines: true,
      keys: ['timestamp','temperature']
    };
    this.downloadCSVdata = data;
    
    this.downloadCSVdata.sort((val1, val2)=> {
      return new Date(val2.timestamp).getTime() - new Date(val1.timestamp).getTime()
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getGraphData(startDate: any, endDate: any, sensorID: any): Observable<any> {
    return this.requesterService.getSensorDetailsbyIDforGraph('/graphdata',
      {
        ID: sensorID,
        startDate: startDate,
        endDate: endDate
      }
    );
  }

  ngAfterViewChecked() {
    document.querySelector('angular2csv > button').innerHTML = '<i class="glyphicon glyphicon-download-alt text-white"></i>';
  }

  openModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template);
    this.modalRef = this.modalService.show(FilterbarModelComponent);
    // this.modalRef.content.onClose.subscribe(
    //   (response: any) => {
    //     console.log(response);
    //   }
    // );
  }

  prepareStockChart(seriesOptions: any) {
    this.options = {
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      },
      title: {
        text: 'Temperature VS Time - Sensor Graph',
        style: {
          color: this.$graph_textcolor,
          fontWeight: 'bold'
        }
      },
      chart: {
        zoomType: 'xy',
        backgroundColor: this.$graph_backgroundcolor,
        type: 'line'
      },
      xAxis: {
        title: {
          enabled: true,
          text: 'Time',
          align: 'middle',
          style: {
            fontWeight: 'normal',
            color: this.$graph_textcolor
          }
        },
        labels: {
          style: {
            color: this.$graph_textcolor
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
            return this.value;
            //return (this.value > 0 ? ' + ' : '') + this.value;
          },
          align: 'left',
          rotation:0,
          y: 5,
          x: -30,
          style: {
            color: this.$graph_textcolor
          }
        },
        gridLineColor: this.$graph_gridlinecolor,
        title: {
          enabled: true,
          text: 'Temperature (°C)',
          align: 'middle',
          style: {
            fontWeight: 'normal',
            color: this.$graph_textcolor
          },
          margin: 40
        },
        plotLines: [{
          value: 18,
          color: this.$graph_threscolor,
          dashStyle: 'shortdash',
          width: 1,
          label: {
              text: 'Min threshold',
              style: {
                color: this.$graph_textcolor
              }
          }
        }, {
            value: 25,
            color: this.$graph_threscolor,
            dashStyle: 'shortdash',
            width: 1,
            label: {
                text: 'Max threshold',
                style: {
                  color: this.$graph_textcolor
                }
            }
        }]
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 2,
        changeDecimals: 2,
        split: true
      },
      plotOptions: {
        series: {
          color: this.$graph_seriescolor,
          zones: [{
            value: 18,
            color: this.$graph_threscolor
          }, {
              value: 25,
              color: this.$graph_seriescolor
          }, {
              color: this.$graph_threscolor
          }]
        }
      },
      series: seriesOptions
    };
    Highcharts.stockChart('highChart', this.options);
    this.spinner.hide();
  }
}
