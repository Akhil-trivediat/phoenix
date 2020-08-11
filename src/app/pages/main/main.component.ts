import { Component } from '@angular/core';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    public AppService = AppService;
    constructor() {

    }
}