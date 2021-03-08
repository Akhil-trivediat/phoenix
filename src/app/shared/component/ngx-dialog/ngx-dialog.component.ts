import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { EmptyObservable } from "rxjs/observable/EmptyObservable";

@Component({
  selector: 'app-ngx-dialog',
  templateUrl: './ngx-dialog.component.html',
  styleUrls: ['./ngx-dialog.component.css']
})
export class NgxDialogComponent implements OnInit {
  public onClose: Subject<any>;
  formControls$: Observable<any>;
  formTitle: string;
  dialogObj: any;
  action: string;
  type: string;

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.formControls$ = this.getformControls(this.dialogObj.formControls);
    this.formTitle = this.dialogObj.action + " " + this.dialogObj.type;
    this.action = this.dialogObj.action;
    this.type = this.dialogObj.type;
  }

  getformControls(controls: any) {
    if(controls) {
      const formControls: any = controls;
      return of(formControls.sort((a, b) => a.order - b.order));
    } else {
      return new EmptyObservable<Response>();
    }
  }

  onCancel() {
    this.bsModalRef.hide();
  }

  onSave(event: any) {
    this.onClose.next(event);
    this.bsModalRef.hide();
  }

  onDelete(event: any) {
    this.onClose.next(event);
    this.bsModalRef.hide();
  }
}
