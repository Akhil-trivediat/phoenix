import { Injectable } from '@angular/core';
import {  HttpHeaders , HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  getAuth() {
    const checkToken = localStorage.getItem('com.pheonix.token');

    const headers = {
      'Content-Type':  'application/x-amz-json-1.1',
      "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
      'Authorization': checkToken,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    };

    return this.http.get('http://localhost:4200/#/login', { headers });
  }
  
}
