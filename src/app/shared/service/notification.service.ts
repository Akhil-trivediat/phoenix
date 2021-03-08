import { Injectable } from '@angular/core';
import { Alert, AlertType } from '../component/alert/alert.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  alerts: Alert[] = [
    {
      type: "",
      message: ""
    }
  ];
  constructor() { }
  
  success(message: string) {
    this.alerts.push(
      {
        type: AlertType[0],
        message: message ? message : "Success"
      }
    );
  }

  info(message: string) {
    this.alerts.push(
      {
        type: AlertType[1],
        message: message ? message : "Info"
      }
    );
  }

  warning(message: string) {
    this.alerts.push(
      {
        type: AlertType[2],
        message: message ? message : "Warning"
      }
    );
  }

  error(message: string) {
     this.alerts.push(
      {
        type: AlertType[3],
        message: message ? message : "Error"
      }
     );
  }

  getAlertMsgToDisplay() {
    return this.alerts;
  }
}
