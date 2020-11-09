import { Routes } from '@angular/router';
import { AppGuard } from './app.guard';
import { ConfirmModule } from './pages/confirm/confirm.module';

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
   path: 'forgotpassword', loadChildren: () => import('./pages/forgotpassword/forgotpassword.module').then(module => module.ForgotPasswordModule)
  },
  {
    path: 'user', loadChildren: () => import('./pages/user/user.module').then(module => module.UserModule)
  },
  {
    path: 'userpage', loadChildren: () => import('./pages/user/userpage/userpage.module').then(module => module.UserpageModule)
  },
{
  path: 'app', canActivate: [AppGuard], loadChildren: () => import('./layout/layout.module').then(module => module.LayoutModule)
}
];
