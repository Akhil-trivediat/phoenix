import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-formcontrol',
  templateUrl: './dynamic-formcontrol.component.html',
  styleUrls: ['./dynamic-formcontrol.component.css']
})
export class DynamicFormcontrolComponent implements OnInit {
  @Input() control: any;
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
