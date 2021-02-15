import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: any;
  private subscription: any;
  constructor(
    private requesterService: RequesterService
  ) { }

  ngOnInit() {
    this.prepareForm();
    this.getUserProfileDetails();
  }

  getUserProfileDetails() {
    let email = localStorage.getItem('USER_NAME');
    this.subscription = this.requesterService.getRequest("/account" + "?email=" + email).subscribe(
      (userProfileDetails) => {
        this.fillFormData(userProfileDetails);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  prepareForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      companyName: new FormControl(''),
      address: new FormControl(''),
      phonenumber: new FormControl(''),
      timezone: new FormControl('')
    });
  }

  fillFormData(formData: any) {
    this.profileForm.patchValue({
      firstName: formData.firstname,
      lastName: formData.lastname,
      email: formData.email,
      companyName: formData.companyname,
      address: formData.address,
      phonenumber: formData.phonenumber,
      timezone: formData.timezone
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
