import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import Auth from '@aws-amplify/auth';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit{
  private checkToken = localStorage.getItem('com.pheonix.token');
  constructor(public authService: AuthenticationService) { }

  ngOnInit(){
    this.authService.getAuth()
      .subscribe(
        data => { 
          console.log(data);
        },
        error => {
          console.log(error);
        }
  );
  }

}
