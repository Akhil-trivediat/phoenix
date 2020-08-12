import { Component, HostBinding } from '@angular/core';
import { RegisterService } from './register.service';
import { LoginService } from '../login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { patternValidator, confirmPasswordValidator} from './validators/register.validators';

const fb: FormBuilder = new FormBuilder();

@Component({
  selector: 'app-login',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.template.html'
})
export class RegisterComponent {
  @HostBinding('class') classes = 'auth-page app';

  public formGroup: FormGroup = fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128), patternValidator]],
    email: ['', [Validators.required, Validators.email]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(125), patternValidator]]
  }, {validators: confirmPasswordValidator});

  constructor(
    public loginService: LoginService,
    public registerService: RegisterService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  public register() {

    // if (!this.isPasswordValid()) {
    //   this.checkPassword();
    // } else {
    //   this.registerService.registerUser({email, password});
    // }
    if (this.formGroup.valid) {
      Auth.signUp({
        username: this.formGroup.get('username').value,
        password: this.formGroup.get('password').value,
        attributes: {
          email: this.formGroup.get('email').value
        }
      }).then(result => {
        this.toastrService.success('Registration Successful');
        this.router.navigate(['confirm']);
  
      });
    } else {
      console.log(this.formGroup);
    }
  }

  checkPassword() {
    // if (!this.isPasswordValid()) {
    //   if (!this.password) {
    //     this.registerService.registerError('Password field is empty');
    //   } else {
    //     this.registerService.registerError('Passwords are not equal');
    //   }
    //   setTimeout(() => {
    //     this.registerService.registerError('');
    //   }, 3 * 1000);
    // }
  }

  isPasswordValid() {
    // return this.password && this.password === this.confirmPassword;
  }

  public googleLogin() {
    this.loginService.loginUser({ social: 'google' });
  }

  public microsoftLogin() {
    this.loginService.loginUser({ social: 'microsoft' });
  }
}
