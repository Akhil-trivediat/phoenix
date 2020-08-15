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
  path: 'scrolling', loadChildren: () => import('./pages/scroller/scroller.module').then(module => module.ScrollerModule)
},
{
  path: 'app', canActivate: [AppGuard], loadChildren: () => import('./layout/layout.module').then(module => module.LayoutModule)
}
];
