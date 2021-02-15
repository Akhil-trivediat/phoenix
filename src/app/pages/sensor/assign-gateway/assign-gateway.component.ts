import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-assign-gateway',
  templateUrl: './assign-gateway.component.html',
  styleUrls: ['./assign-gateway.component.css']
})
export class AssignGatewayComponent implements OnInit {
  assignGatewayForm: any;
  constructor(
    private requesterService: RequesterService
  ) { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.assignGatewayForm = new FormGroup({
      deviceID: new FormControl('', [Validators.required]),
      gatewayID: new FormControl('', [Validators.required])
    });
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
