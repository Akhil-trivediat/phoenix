import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from '../app/shared/service/auth.service';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return this.authService.isLoggedIn();
  }
}
