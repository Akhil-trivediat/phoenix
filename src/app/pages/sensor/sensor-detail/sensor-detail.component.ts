import { Component, OnInit, Inject, LOCALE_ID, TemplateRef   } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RequesterService } from '../../../shared/service/requester.service';
import { SensorService } from '../services/sensor.service';
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
  sensorname: string;
  sensorDetailsForm:  any;
  addSensorForm: any;
  isOnline: boolean = false;
  sensorDataTable: any = [];
  graphData: any =[];
  names: any = ['MSFT', 'AAPL', 'GOOG'];
  multipleSeriesOptions: any = [];
  selectedSensor: any;
  ddSensorsList: Array<Object> = [{
    id: ""
  }];
  yaxisList: Array<Object> = [{
    id: ""
  }];
  sensorModel: any;
  aSensorsSelectedforGraph: any = [];
  sSensorsSelectedforGraph: string;
  startdate: string = "";
  enddate:string = "";

  mapSensorDetailsData = {
    id: "",
    name: "",
    gatewayName: "",
    readingValue: "",
    lastCommDate: "",
    location: "",
    minThreshold: "",
    maxThreshold: "",
    status: "",
    sensorstobeDisplayedonGraph: [],
    uom: ""
  };

  columns = [
    { name: 'timestamp', prop: 'timestamp' }, 
    { name: 'Temperature (°C)', prop: 'temperature' }
  ];

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

  isCollapsed = true;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private route: ActivatedRoute,
    private requesterService: RequesterService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private sensorService: SensorService
  ) { 
    this.subscription = this.route.params.subscribe(params => {

      this.sensorid = params['id'];

      this.updateSensorModel({
        id: this.sensorid,
        sensorstobeDisplayedonGraph: [this.sensorid]
      });

    });
  }
  
  ngOnInit() {

    this.yaxisList = [
      {id: "Channel1"},
      {id: "Channel2"},
      {id: "Channel3"},
      {id: "Humidity"}
    ];

    this.spinner.show();

    this.getSensorList();

    //this.loadGraph(this.startdate, this.enddate, this.sensorid);

    this.prepareForm();

    this.getSensorDetails();
  }

  updateSensorModel(sensor: any) {
    let that = this;

    Object.keys(sensor).forEach(function(key,index) {

      if(key == "sensorstobeDisplayedonGraph") {

        sensor[key].forEach(sens => {
          that.mapSensorDetailsData[key].push(sens);
        });

      } else {
        that.mapSensorDetailsData[key] = sensor[key];
      }

    });
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
    
    if(event) {
      this.startdate = event[0].toISOString();
      this.enddate = event[1].toISOString();
  
      this.loadGraph(this.startdate, this.enddate, this.sensorid);
    }
    
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

  prepareForm() {
    this.sensorDetailsForm = new FormGroup({
      sensorID: new FormControl({value: '', disabled: true}, [Validators.required]),
      readingValue: new FormControl({value: '', disabled: true}, [Validators.required]),
      readingUnit: new FormControl({value: '', disabled: true}, [Validators.required]),
      lastCommDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      location: new FormControl({value: '', disabled: true}, [Validators.required]),
      gatewayName: new FormControl({value: '', disabled: true}, [Validators.required]),
      minThres: new FormControl({value: '', disabled: true}, [Validators.required]),
      maxThres: new FormControl({value: '', disabled: true}, [Validators.required]),
      sensorType: new FormControl({value: '', disabled: true}, [Validators.required])
    }); 

    this.addSensorForm = new FormGroup({
      sensorID: new FormControl('')
    });
  }

  fillFormData(sensorData: any) {
    if(sensorData) {
      this.sensorDetailsForm.patchValue({
        sensorID: sensorData.id,
        readingValue: sensorData.readingValue,
        readingUnit: "",
        lastCommDate: sensorData.lastCommDate,
        location: sensorData.location,
        gatewayName: sensorData.gatewayName,
        minThres: sensorData.minThreshold + " " + sensorData.uom,
        maxThres: sensorData.maxThreshold + " " + sensorData.uom,
        sensorType: "M500"
      });
    }
  }

  getSensorDetails() {

    this.sensorService.getSensorDetailswithFormattedResponse(this.sensorid).subscribe(
      (sensor) => {

        this.updateSensorModel({
          name: sensor.name,
          gatewayName: sensor.gatewayName,
          readingValue: sensor.readingValue,
          lastCommDate: sensor.lastCommDate,
          location: sensor.location,
          minThreshold: sensor.minThreshold,
          maxThreshold: sensor.maxThreshold,
          status: sensor.status,
          uom: sensor.uom
        });

        this.setSensorStatus(this.mapSensorDetailsData.status);

        this.fillFormData(this.mapSensorDetailsData);

        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  setSensorStatus(status: string) {
    if(status.toLowerCase() == "online") {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
  }

  onItemChanged($event) {
    
    const sensorsToCompare: [] = $event;

  }

  onItemAdded($event) {

    const sensorAddedForComparision = $event;
    this.mapSensorDetailsData.sensorstobeDisplayedonGraph.push(sensorAddedForComparision.id);

    this.addSensorToGraphForComparision(sensorAddedForComparision.id);

  }

  onItemRemoved($event) {

    const sensorRemovedFromComparision = $event;

    var indexofRemovedItem = this.mapSensorDetailsData.sensorstobeDisplayedonGraph.indexOf(sensorRemovedFromComparision.value.id, 0);
    if (indexofRemovedItem > -1) {
      this.mapSensorDetailsData.sensorstobeDisplayedonGraph.splice(indexofRemovedItem, 1);
    }

    this.removeSensorFromGraph(sensorRemovedFromComparision.value.id);

  }

  addSensorToGraphForComparision(sensorsTobeAdded: any) {

    let graphData: any = [];

    this.sensorService.getDatamessagesbySensorID(sensorsTobeAdded,this.startdate,this.enddate).subscribe(
      (response) => {

        response.forEach((data: any) =>{
          let timestamp = new Date(data.messagedate);
          if (data.rawvalue) {
            graphData.push([
              timestamp.getTime(), //change to local time
              data.rawvalue
            ]);
          }
        });

        this.multipleSeriesOptions.push(
          {
            name: sensorsTobeAdded,
            data: graphData
          }
        );

        this.multipleSeriesOptions = Array.from(this.multipleSeriesOptions.reduce((m, t) => m.set(t.name, t), new Map()).values());
        this.prepareStockChart(this.multipleSeriesOptions);

      }
    );

  }

  removeSensorFromGraph(sensorToRemove) {

    var removeIndex = this.multipleSeriesOptions.map(function(item) { return item.name; }).indexOf(sensorToRemove);

    this.multipleSeriesOptions.splice(removeIndex, 1);

    this.prepareStockChart(this.multipleSeriesOptions);

  }
  onClear() {

    let that = this;

    this.mapSensorDetailsData.sensorstobeDisplayedonGraph = 
      this.mapSensorDetailsData.sensorstobeDisplayedonGraph.filter(function(value, index, arr){ 
        return value == that.sensorid;
      });

    this.multipleSeriesOptions = 
      this.multipleSeriesOptions.filter(function(value, index, arr){ 
        return value.name == that.sensorid;
      });

    this.prepareStockChart(this.multipleSeriesOptions);

  }

  loadGraph(startdate,enddate,sensorid) {

    this.spinner.show();

    let sensorDataTableRows: any = [];
    this.multipleSeriesOptions = [];
    this.graphData = [];

    this.sensorService.getDatamessagesbySensorID(sensorid,startdate,enddate).subscribe(
      response => {

        response.forEach((data: any) =>{
          let timestamp = new Date(formatDate(data.messagedate,'MM/dd/yyyy,HH:mm',this.locale));
          
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
    document.querySelector('angular2csv > button').innerHTML = 'Download';
    //<i class="glyphicon glyphicon-download-alt text-white"></i>
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
    let that = this;
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
        //text: 'Temperature VS Time - Sensor Graph',
        style: {
          color: this.$graph_textcolor,
          fontWeight: 'bold'
        }
      },
      chart: {
        zoomType: 'xy',
        backgroundColor: this.$graph_backgroundcolor,
        type: 'line',
        //height: (9 / 16 * 100) + '%' // 16:9 ratio
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
          var positions = [];

          var minTick = Math.ceil(this.dataMin / 10) * 10;
          var maxTick = Math.ceil(this.dataMax / 10) * 10;
          var minThresh = +that.mapSensorDetailsData.minThreshold;
          var maxThresh = +that.mapSensorDetailsData.maxThreshold;

          var tickStart = minTick;
          var tickEnd = maxTick;

          if(minThresh < tickStart) {
            tickStart = minThresh;
          }

          if(maxThresh > tickEnd) {
            tickEnd = maxThresh;
          }

          tickStart = tickStart - 10;
          tickEnd = tickEnd + 20;

          
          for(var i = tickStart ; i <= tickEnd ; i++) {
            if(i%10 == 0) {
              positions.push(i);
            }
          }
          return positions;
        },
       // tickInterval: 10,
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
          value: this.mapSensorDetailsData.minThreshold,
          color: this.$graph_threscolor,
          dashStyle: 'shortdash',
          width: 1,
          label: {
              text: this.mapSensorDetailsData.minThreshold + " " + this.getUnitofMeasurment(this.mapSensorDetailsData.uom),
              style: {
                color: this.$graph_textcolor
              }
          }
        }, {
            value: this.mapSensorDetailsData.maxThreshold,
            color: this.$graph_threscolor,
            dashStyle: 'shortdash',
            width: 1,
            label: {
                text: this.mapSensorDetailsData.maxThreshold + " " + this.getUnitofMeasurment(this.mapSensorDetailsData.uom),
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
            value: this.mapSensorDetailsData.minThreshold,
            color: this.$graph_threscolor
          }, {
              value: this.mapSensorDetailsData.maxThreshold,
              color: this.$graph_seriescolor
          }, {
              color: this.$graph_threscolor
          }]
        }
      },
      series: seriesOptions,
      credits: {
        enabled: false
      }
    }; 
    Highcharts.setOptions({
      time: {
        useUTC: false
      }
    });
    Highcharts.stockChart('highChart', this.options);
    this.spinner.hide();
  }

  getUnitofMeasurment(uom: string) {
    if( uom.toLowerCase() == "celsius" ) {
      return "°C";
    } else if ( uom.toLowerCase() == "fahrenheit" ) {
      return "°F";
    } else {
      return "";
    }
  }

  loadGraphasPromise(startdate,enddate,sensorid) {

    let sensorDataTableRows: any = [];
    this.multipleSeriesOptions = [];

    this.sensorService.getDatamessagesbySensorIDasPromise(sensorid,startdate,enddate).then(
      response => {
        console.log(response);

        let timestamp = new Date(response.messagedate);
        if (response.rawvalue) {
          this.graphData.push([
            timestamp.getTime(),
            +parseFloat(response.rawvalue).toFixed(2)
          ]);
          sensorDataTableRows.push({
            'timestamp' : formatDate(timestamp,'MM/dd/yyyy,HH:mm',this.locale),
            'temperature' : parseFloat(response.rawvalue).toFixed(2)
          });
        }

        this.setSensorDataTable(sensorDataTableRows);
        this.multipleSeriesOptions.push(
          {
            name: this.sensorid,
            data: this.graphData
          }
        );
      
        this.prepareStockChart(this.multipleSeriesOptions);

      }

    );
  }

}
