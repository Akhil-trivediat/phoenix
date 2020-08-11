import { Component, OnInit, HostBinding } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Auth} from 'aws-amplify';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

const fb:FormBuilder = new FormBuilder();

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  @HostBinding('class') classes = 'auth-page app';
  public formGroup: FormGroup = fb.group({
    username: '',
    confirmCode: ''
  });
  constructor(private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  confirmCode() {
    Auth.confirmSignUp(this.formGroup.get('username').value, this.formGroup.get('confirmCode').value).then(result => {
      console.log(result);
      this.toastrService.success('Confirmation Successful');
      this.router.navigate(['login']);
    });
  }

}
