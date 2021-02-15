import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-assign-sensor',
  templateUrl: './assign-sensor.component.html',
  styleUrls: ['./assign-sensor.component.css']
})
export class AssignSensorComponent implements OnInit {
  assignSensorForm: any;
  constructor(
    private requesterService: RequesterService
  ) { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.assignSensorForm = new FormGroup({
      sensorID: new FormControl('', [Validators.required]),
      gatewayID: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required])
    });
  }

  onassignSensorFormSubmit(form: NgForm){
    let requestBody = {
      action: "Update",
      type: "Gateway",
      data: form.value
    };
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(requestBody)).subscribe(
      (response) => {
        console.log(response); 
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
