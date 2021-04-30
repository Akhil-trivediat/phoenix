// *********** This service contains all the http requests ************ // 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";

import { environment } from '../../../environments/environment';

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

  getRequestParams(path: string, paramsData: HttpParams): Observable<any>{
    return this.http.get<any>(environment.serverUrl + path, {params: paramsData}).pipe(
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

  updateRequest(path: string, postData: any): Observable<any>{
    return this.http.put<any>(environment.serverUrl + path, postData).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  deleteRequest(path: string, paramsData: HttpParams): Observable<any>{
    return this.http.delete<any>(environment.serverUrl + path, {params: paramsData}).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  getSensorDetailsbyIDforGraph(path: string, params: any): Observable<any>{
    let id = params.ID;
    let startDate = params.startDate;
    let endDate = params.endDate;
    
    startDate = startDate == "" ? new Date(Date.now() - 86400 * 1000).toISOString() : startDate;
    endDate = endDate == "" ? new Date(Date.now()).toISOString() : endDate;

    return this.http.get<any>(environment.serverUrl + path + `?id=${id}&startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error) => {
        return this.handleExternalRequestException(error);
      })
    );
  }

  getGraphDataSyncRequest(path: string, params: any) {
    let id = params.ID;
    let startDate = params.startDate;
    let endDate = params.endDate;

    startDate = startDate == "" ? new Date(Date.now() - 86400 * 1000).toISOString() : startDate;
    endDate = endDate == "" ? new Date(Date.now()).toISOString() : endDate;
    
    return  this.http.get<any>(environment.serverUrl + path + `?id=${id}&startDate=${startDate}&endDate=${endDate}`).toPromise();
  }

  getDashboardUrl(path: string, email: string) {
    const url = environment.serverUrl + path + `?email=${email}`;
    return this.http.get(url);
  }
}
