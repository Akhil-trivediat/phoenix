// *********** This service contains all the http requests ************ // 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class RequesterService {

  constructor(
    private http: HttpClient
  ) { }

  private handleExternalRequestException(error: any) {
    return throwError(error);
  }

  getRequest(path: string): Observable<any>{
    return this.http.get<any>(environment.serverUrl + path).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  addRequest(path: string, postData: any): Observable<any>{
    return this.http.post<any>(environment.serverUrl + path, postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  updateRequest(path: string, postData: any){
    return this.http.put<any>(environment.serverUrl + '/account/user', postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  deleteRequest(path: string, postData: any){
    postData = {};
    return this.http.delete<any>(environment.serverUrl + '/account/user', postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  getGraphRequest(path: string, params: any): Observable<any>{
    let queryParams = params.ID;
    return this.http.get<any>(environment.serverUrl + path + "?id=" + queryParams).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  getDashboardUrl(path: string, email: string) {
    const url = environment.serverUrl + path + `?email=${email}`;
    return this.http.get(url);
  }

  getGraphDataSyncRequest(path: string, params: any) {
    let queryParams = params.ID;
    return  this.http.get<any>(environment.serverUrl + path + "?id=" + queryParams).toPromise();
  }
}
