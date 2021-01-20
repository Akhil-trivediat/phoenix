import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';
import { AuthService } from '../../shared/service/auth.service';
import { RequesterService } from '../../shared/service/requester.service'

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    public AppService = AppService;
    username: string;
    location: string;
    
    constructor(
        private authService: AuthService,
        private requesterService: RequesterService
    ) { }

    ngOnInit() {
        console.log(AppService.token);
        this.getUserDetails();
    }

    setLocation(location: string): void {
        this.location = location;
    }

    setUserName(username: string): void {
        this.username = username;
    }

    getUserDetails() {
        this.setUserName(localStorage.getItem('USER_NAME'));
        this.getLocation(localStorage.getItem('USER_NAME'));

        // this.authService.getCurrentUserInfo().then(
        //     (userDetails) => {
        //         this.setUserName(userDetails.username);
        //         this.getLocation(userDetails.username);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
    }

    getLocation(username: string) {
        this.requesterService.getRequest('/account/user/location').subscribe(
            (response) => {
                this.setLocation(response[0].location);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}