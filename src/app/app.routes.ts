import { Routes } from '@angular/router';
import { AppGuard } from './app.guard';

export const ROUTES: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'
},
{
  path: 'login', loadChildren: () => import('./pages/login/login.module').then(module => module.LoginModule)
},
{
  path: 'register', loadChildren: () => import('./pages/register/register.module').then(module => module.RegisterModule)
},
{
  path: 'confirm', loadChildren: () => import('./pages/confirm/confirm.module').then(module => module.ConfirmModule)
},
 {
   path: 'changepassword', loadChildren: () => import('./pages/forgotpassword/forgotpassword.module').then(module => module.ForgotPasswordModule)
 }, 
{
  path: 'accountRegistration', loadChildren: () => import('./pages/account-registration/account-registration.module').then(module => module.AccountRegistrationModule)
},
  {
  path: 'app', canActivate: [AppGuard], loadChildren: () => import('./layout/layout.module').then(module => module.LayoutModule)
}
];
