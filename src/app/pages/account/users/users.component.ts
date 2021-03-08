import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../../../models/commonmodel.data';
import { UsersService } from './users.service';
import { RequesterService } from '../../../shared/service/requester.service';
import { NgxDialogComponent } from 'src/app/shared/component/ngx-dialog/ngx-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public columnMode: typeof ColumnMode = ColumnMode;
  bsModalRef: BsModalRef;
  emptyRowObj: any = {
    active: "",
    email: "",
    name: "",
    orgname: "",
    phonenumber: ""
  };

  constructor(
    private usersService: UsersService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private requesterService: RequesterService,
    private router: Router
  ) { }
  usersArray = [];
  ngOnInit() {
    this.spinner.show();
    this.getAllUsers();
    this.usersService.events$.forEach(
      (result) => {
        console.log(result);
        if (result.event == 'Add') {
          this.addUser(result.newUserData);
        } else if (result.event == 'Update') {
          this.updateUser(result);
        } else if (result.event == 'Delete') {
          this.deleteUser(result);
        }
      });
  }

  getAllUsers(){
    let users = [];
    this.usersService.getAllUsers().subscribe(
      (response) => {
        response.forEach((user) => {
          (users as Array<User>).push({
            'active': user.active,
            'name': user.firstname + " " + user.lastname,
            'email': user.email,
            'phonenumber': user.phonenumber,
            'orgname': user.orgname,
            'firstname': user.firstname,
            'lastname': user.lastname
          });
        });
        this.usersArray = users;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  addUser(postData){
    //let postData;
    this.usersService.addUser(postData).subscribe((response) => {
      console.log('User Added');
      this.getAllUsers();
    });
  }

  updateUser(postData){
    this.usersService.updateUser(postData).subscribe((response) => {
      console.log('User Updated');
      this.getAllUsers();
    });
  }

  deleteUser(postData){
    this.usersService.deleteUser(postData).subscribe((response) => {
      console.log('User Deleted');
      this.getAllUsers();
    });
  }

  openDialog(action: string, userObject: object){
    let formControls: any;
    if(action === "Add") {
      formControls = this.prepareFormControl(userObject,false);
    } else {
      formControls = this.prepareFormControl(userObject,true);
    }
    const initialState = {
      dialogObj : {
        action: action,
        type: "User",
        formControls: formControls
      }
    }
    this.bsModalRef = this.modalService.show(NgxDialogComponent, {initialState});
    this.bsModalRef.content.onClose.subscribe(
      (response: any) => {
        console.log(response);
        let formValue = response.data.getRawValue();
        if(response.action === "Delete") {
          this.deleteRequest(formValue);
        } else if(response.action === "Edit") {
          this.updateRequest(formValue);
        } else if(response.action === "Add") {
         // this.addRequest(formValue);
        }
      }
    );
  }

  addRequest(formValue: any) {
    let userData: any = {
      email: formValue.email,
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      orgname: formValue.orgname,
      phoneno: formValue.phoneno
    };
    let requestBody = {
      action: "Add",
      type: "User",
      data: userData
    };
    this.requesterService.addRequest("/triggerSNS", JSON.stringify(requestBody)).subscribe(
      (response) => {
        console.log(response);
        this.getAllUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateRequest(formValue: any) {
    let postData: any = {
      email: formValue.email,
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      orgname: formValue.orgname,
      phoneno: formValue.phoneno
    };
    this.requesterService.updateRequest1("/user", postData).subscribe(
      (response) => {
        console.log(response);
        this.getAllUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteRequest(formValue: any) {
    
  }

  onCheckBoxSelected(rowCheckedDetails: object){
    this.usersService.updateUser(rowCheckedDetails).subscribe((response) => {
      console.log('User Updated');
      this.getAllUsers();
    });
  }

  prepareFormControl(userObject: any, disabledState: boolean) {
    const formControls: any = [
      {
        key: 'email',
        label: 'Email*: ',
        value: userObject.email,
        required: false,
        disabled: disabledState,
        order: 1,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'firstname',
        label: 'First Name*: ',
        value: userObject.firstname,
        required: true,
        disabled: false,
        order: 2,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'lastname',
        label: 'Last Name*: ',
        value: userObject.lastname,
        required: false,
        disabled: false,
        order: 3,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'orgname',
        label: 'Organization Name*: ',
        value: userObject.orgname,
        required: false,
        disabled: false,
        order: 4,
        controlType: 'textbox',
        type: 'text'
      },
      {
        key: 'phoneno',
        label: 'Phone Number*: ',
        value: userObject.phoneno,
        required: false,
        disabled: false,
        order: 5,
        controlType: 'textbox',
        type: 'text'
      }
    ];

    return formControls;
  }
  
}
