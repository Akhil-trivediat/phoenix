import { Injectable } from '@angular/core';
import { Alert, AlertType } from '../component/alert/alert.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  
  alert: Alert;

  success(message: string) {
    this.alert = {
      type: AlertType[0],
      message: message
    };
  }

  info(message: string) {
    this.alert = {
      type: AlertType[1],
      message: message
    };
  }

  warning(message: string) {
    this.alert = {
      type: AlertType[2],
      message: message
    };
  }

  error(message: string) {
     this.alert = {
       type: AlertType[3],
       message: message
     };
  }

  getAlertMsgToDisplay() {
    return this.alert;
  }
}
