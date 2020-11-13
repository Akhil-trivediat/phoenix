import { Routes, RouterModule } from '@angular/router';
import { Layout } from './layout.component';
import { ResetPasswordComponent } from '../shared/component/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '', component: Layout, children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', loadChildren: () => import('../pages/main/main.module').then(module => module.MainModule) },
      { path: 'users', loadChildren: () => import('../pages/account/users/users.module').then(module => module.UsersModule)},
      { path: 'scrolling', loadChildren: () => import('../pages/scroller/scroller.module').then(module => module.ScrollerModule) },
      { path: 'profile', loadChildren: () => import('../pages/account/profile/profile.module').then(module => module.ProfileModule) },
      { path: 'resetPassword', component: ResetPasswordComponent }

    ]
  }
];

export const ROUTES = RouterModule.forChild(routes);
