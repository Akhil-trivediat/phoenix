import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() fullScreen: boolean;
  @Input() spinnerSize: string;
  
  spinner: any = {
    type: "",
    size: "",
    fullscreen: true 
  };

  constructor() { }

  ngOnInit() {
    this.spinner.type = "ball-spin-clockwise";
    this.spinner.size = this.spinnerSize;
    this.spinner.fullscreen = this.fullScreen;
  }
}
