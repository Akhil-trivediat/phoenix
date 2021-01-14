import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { RequesterService } from '../../../shared/service/requester.service';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _subject = new Subject<any>();
  constructor(
    private http: HttpClient,
    private requesterService: RequesterService
  ) { }

  newEvent(event) {
    this._subject.next(event);
  }

  get events$ () {
    return this._subject.asObservable();
  }

  getAllUsers(): Observable<any>{
    return this.requesterService.getRequest('/account/user').pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  addUser(postData: any): Observable<any>{
    return this.requesterService.addRequest('/account/user', postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  updateUser(postData: any){
    return this.requesterService.updateRequest('/account/user', postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  deleteUser(postData: any){
    return this.requesterService.deleteRequest('/account/user', postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  //Error Handling Method
  private handleExternalRequestException(error) {
    return throwError(error);
  }
}
