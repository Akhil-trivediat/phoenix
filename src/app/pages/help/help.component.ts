import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  helpForm: any;

  constructor() { }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.helpForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      message: new FormControl('')
    });
  }

  onSubmit(form: NgForm) {
    // submit the form

    form.reset();
  }

  onCancel(form: NgForm) {
    form.reset();
  }

}
