import { Component, OnInit } from '@angular/core';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '../../../models/commonmodel.data';
import { UsersService } from './users.service';
import { DialogComponent } from './dialog/dialog.component'

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
    private modalService: BsModalService
  ) { }
  usersArray = [];
  ngOnInit() {
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
      },
      (error) => {
        console.log(error);
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
    const initialState = {
      dialogObj : {
        action: action,
        userObject: userObject
      }
    }
    this.bsModalRef = this.modalService.show(DialogComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  onCheckBoxSelected(rowCheckedDetails: object){
    this.usersService.updateUser(rowCheckedDetails).subscribe((response) => {
      console.log('User Updated');
      this.getAllUsers();
    });
  }
  
}
