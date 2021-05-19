import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-data-connector',
  templateUrl: './data-connector.component.html',
  styleUrls: ['./data-connector.component.css']
})
export class DataConnectorComponent implements OnInit {

  exportToS3Form: any;
  exportToAzureForm: any;
  exportToGoogleForm: any;

  constructor() { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.exportToS3Form = new FormGroup({
      arn: new FormControl('', [Validators.required]),
      accesskey: new FormControl('', [Validators.required]),
      secret: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      assumeRole: new FormControl('', [Validators.required])
    });

    this.exportToAzureForm = new FormGroup({
      accountname: new FormControl('', [Validators.required]),
      accountkey: new FormControl('', [Validators.required]),
      containerid: new FormControl('', [Validators.required])
    });

    this.exportToGoogleForm = new FormGroup({
      accesskey: new FormControl('', [Validators.required]),
      secret: new FormControl('', [Validators.required]),
      bucketname: new FormControl('', [Validators.required])
    });
  }

  onExportToS3FormSubmit(form: NgForm) {
    form.reset();
  }

  onExportToAzureFormSubmit(form: NgForm) {
    form.reset();
  }

  onExportToGoogleFormSubmit(form: NgForm) {
    form.reset();
  }

  onCancel(form: NgForm) {
    form.reset();
  }

}
