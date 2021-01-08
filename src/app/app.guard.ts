import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { Auth } from 'aws-amplify';
import {AppService} from './app.service';
import { AuthService } from '../app/shared/service/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
const jwt = new JwtHelperService();

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // let bvalue;
    // // call authservice.issessionvalid();
    // this.authService.isSessionValid();
    // return bvalue;
    //return AppService.isLoggedIn;

    // return from(Auth.currentSession()).subscribe(
    //   (response) => {
    //     let exp_date = jwt.getTokenExpirationDate(response.getIdToken().getJwtToken());
    //     let now: Date = new Date();
    //     return observableOf(true);
    //   }
    // );

     return from(Auth.currentSession()).pipe(
      map((session) => {
       // session.getIdToken().getJwtToken()
       let exp_date = jwt.getTokenExpirationDate(session.getIdToken().getJwtToken());
       let now: Date = new Date();
       return now < exp_date;
      })
    );

    //return true;

  }
}
