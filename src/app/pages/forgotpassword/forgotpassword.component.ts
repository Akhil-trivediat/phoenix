import {Component, HostBinding, OnInit} from '@angular/core';
import {Auth} from 'aws-amplify';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

const fb = new FormBuilder();
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @HostBinding('class') classes = 'auth-page app';
  public formGroup: FormGroup = fb.group({
    username: ''
  })
  errorMessage: string;
  isFetching = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  sumbitemail() {
    // Send confirmation code to user's email
    this.isFetching = true;
    Auth.forgotPassword(this.formGroup.get('username').value)
      .then(data => {
         this.isFetching = false;
          console.log(data)
         // this.router.navigate(['app/main']);
          //navigate to reset password
           }
        ).catch(err => {
            this.isFetching = false;
              this.errorMessage = err;
          console.log(err)
          }
       );

  }
}
