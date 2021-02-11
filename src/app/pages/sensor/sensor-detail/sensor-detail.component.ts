import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.css']
})
export class SensorDetailComponent implements OnInit {
  sensorid: number;
  private subscription: any;
  sensorDetailsForm:  any;
  isOnline: boolean = false;
  showGraph: boolean = false;

  finalGraphData: any = [];

  constructor(
    private route: ActivatedRoute,
    private requesterService: RequesterService
  ) { 
    this.subscription = this.route.params.subscribe(params => {
      this.sensorid = +params['id'];
    });
    this.getGraphData();
  }

  ngOnInit() {
   this.prepareForm();
  }

  prepareForm() {
    this.sensorDetailsForm = new FormGroup({
      sensorID: new FormControl({value: '', disabled: true}, [Validators.required]),
      sensorName: new FormControl({value: '', disabled: true}, [Validators.required]),
      readingValue: new FormControl({value: '', disabled: true}, [Validators.required]),
      readingUnit: new FormControl({value: '', disabled: true}, [Validators.required]),
      lastCommDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      networkName: new FormControl({value: '', disabled: true}, [Validators.required]),
      gatewayName: new FormControl({value: '', disabled: true}, [Validators.required]),
      minThres: new FormControl({value: '', disabled: true}, [Validators.required]),
      maxThres: new FormControl({value: '', disabled: true}, [Validators.required])
    }); 
  }

  async getGraphData() {
    let graphData: any =[];
    await this.requesterService.getGraphRequest('/graphdata',{ID: this.sensorid}).toPromise().then(
      response => {
        response.forEach((data: any) =>{
          if (data.temp) {
            graphData.push({
              "name": data.timestamp,
              "value": data.temp
            });
          }
        });
        this.finalGraphData = graphData;
        this.showGraph = true;
      },
      error => {
        console.log(error);
      }
    );
  } 

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
