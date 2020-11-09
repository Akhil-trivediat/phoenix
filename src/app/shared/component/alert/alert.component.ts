import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Alert, AlertType } from './alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(
    private notificationService: NotificationService
  ) { }
  
  alert: Alert;
  dismissible = true;

  ngOnInit() {
    this.alert = this.notificationService.getAlertMsgToDisplay();
  }
}
