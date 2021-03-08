import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-assign-gateway',
  templateUrl: './assign-gateway.component.html',
  styleUrls: ['./assign-gateway.component.css']
})
export class AssignGatewayComponent implements OnInit {
  assignGatewayForm: any;
  sensorID: string;
  ddGatewaysList: Array<Object>;
  selectedGateway: any;
  gatewayID: string;

  constructor(
    private requesterService: RequesterService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sensorID = params['id'];
    });
    this.prepareForm();
    this.getGatewayList();
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getGatewayID() {
    return localStorage.getItem('GATEWAY_ID');
  }

  prepareForm() {
    this.assignGatewayForm = new FormGroup({
      sensorID: new FormControl({value: this.sensorID, disabled: true}, [Validators.required]),
      gatewayID: new FormControl('', [Validators.required])
    });
  }

  getGatewayList() {
    let params = new HttpParams();
    params = params.append('email', this.getUserDetails());
    this.gatewayID = this.getGatewayID();
    this.requesterService.getRequestParams("/gateway", params).subscribe(
      (response) => {
        let gatewayArray = [];
        response.forEach((sensor: any) => {
          gatewayArray.push({
            id: sensor.id
          });
        });
        this.ddGatewaysList = gatewayArray;
        this.ddGatewaysList = this.ddGatewaysList.filter(item => item["id"] != this.gatewayID);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  onassignGatewayFormSubmit(form: NgForm){
    let requestBody = {
      action: "Update",
      type: "Sensor",
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
