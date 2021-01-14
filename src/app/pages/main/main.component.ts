import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    public AppService = AppService;
    constructor() {

    }

    ngOnInit() {
        console.log(AppService.token);
    }
}