import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { AppConfig } from './app.config';
import { AuthService } from '../app/shared/service/auth.service'

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  config;

  constructor(
    appConfig: AppConfig,
    private authService: AuthService
  ) {
    this.config = appConfig.getConfig();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://osikxsq11j')) {
      return next.handle(req);
    } 
    //Interceptor for Cognito API
    else if (req.url.match(/amazonaws.com/)) {
      return this.authService
        .getAuthorizationToken()
        .mergeMap((token: string) => {
          let authReq = req.clone({
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: token,
            }),
          });

          return next.handle(authReq);
        });
    } //For all other requests
    else {
      return next.handle(req);
    }




    const idToken = localStorage.getItem("token");

    this.authService.getAuthorizationToken();

    if(idToken){
      const cloned = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: idToken
        })
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }

    // req = req.clone({ url: this.config.baseURLApi + req.url });

    // const token: string = localStorage.getItem('token');
    // if (token) {
    //   req = req.clone({
    //     headers: req.headers.set('Authorization', 'Bearer ' + token)
    //   });
    // }

    //return next.handle(req);
  }
}
