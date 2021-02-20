import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router} from '@angular/router';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-assign-sensor',
  templateUrl: './assign-sensor.component.html',
  styleUrls: ['./assign-sensor.component.css']
})
export class AssignSensorComponent implements OnInit {
  assignSensorForm: any;
  gatewayID: string;
  ddSensorsList: Array<Object>;
  selectedSensor: any;

  constructor(
    private router: Router,
    private requesterService: RequesterService
  ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {
        gatewayID: string
      };
      this.gatewayID = state.gatewayID;
   }

  ngOnInit() {
    this.ddSensorsList = [
      { id : "1" },
      { id : "2" },
      { id : "3" }
    ];
    this.prepareForm();
    this.getSensorList();
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getSensorList() {
    let email = this.getUserDetails();
    let gatewayID = "null";
    let params = "?email=" + email + "&gatewayID=" + gatewayID
    this.requesterService.getRequest("/sensor" + params).subscribe(
      (response) => {
        console.log(response); 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  prepareForm() {
    this.assignSensorForm = new FormGroup({
      sensorID: new FormControl('', [Validators.required]),
      gatewayID: new FormControl(this.gatewayID, [Validators.required]),
      location: new FormControl('', [Validators.required])
    });
  }

  onassignSensorFormSubmit(form: NgForm){
    let sensorData = {
      "clientId": form.value.gatewayID,
      "command": "ADDTRANSMITTER",
      "transmitterids": [form.value.sensorID.id]
    }

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
