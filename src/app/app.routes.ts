import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppGuard } from './app.guard';

const ROUTES: Routes = [
  {
    path: 'login', loadChildren: () => import('./pages/login/login.module').then(module => module.LoginModule)
  },
  {
    path: 'app', canActivate: [AppGuard], loadChildren: () => import('./layout/layout.module').then(module => module.LayoutModule)
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
    path: '',   redirectTo: 'login', pathMatch: 'full'
  },
  { path: '**', redirectTo: 'app' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}


// RouterModule.forRoot(ROUTES, {
//   useHash: false,
//   preloadingStrategy: PreloadAllModules
// }),