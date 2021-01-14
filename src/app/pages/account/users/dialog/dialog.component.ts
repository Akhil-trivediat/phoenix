import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users.service'

const fb = new FormBuilder();

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  action: string;
  dialogObj: any;
  dialogData: any;

  userForm: FormGroup;
  private email: FormControl;
  private firstname: FormControl;
  private lastname: FormControl;
  private orgname: FormControl;
  private phoneno: FormControl;

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService
  ) { 
    this.userForm = new FormGroup({});
  }

  ngOnInit() {
    this.action = this.dialogObj.action;
    this.dialogData = this.dialogObj.userObject;
    this.prepareNewDialog();
  }

  prepareNewDialog() {
    this.firstname = new FormControl(
      this.dialogData.firstname,
      Validators.required
    );

    this.lastname = new FormControl(
      this.dialogData.lastname,
      Validators.required
    );

    this.orgname = new FormControl(
      this.dialogData.orgname,
      Validators.required
    );

    this.phoneno = new FormControl(
      this.dialogData.phonenumber,
      Validators.required
    );

    if (this.action == 'Add') { 
      this.email = new FormControl('', [Validators.required, Validators.email]);
    } else {
      this.email = new FormControl({
        value: this.dialogData.email,
        disabled: true,
      });
    }
    this.userForm.addControl('email', this.email);
    this.userForm.addControl('firstname', this.firstname);
    this.userForm.addControl('lastname', this.lastname);
    this.userForm.addControl('orgname', this.orgname);
    this.userForm.addControl('phoneno', this.phoneno);
  }

  userAction() {
    this.usersService.newEvent({
      event: this.action,
      newUserData: this.userForm.value
    });
    this.bsModalRef.hide();
  }

}
