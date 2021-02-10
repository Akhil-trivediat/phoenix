import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.sensorid = +params['id'];
   });

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
