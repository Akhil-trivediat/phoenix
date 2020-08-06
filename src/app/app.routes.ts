import { Routes } from '@angular/router';
import { AppGuard } from './app.guard';

export const ROUTES: Routes = [{
  path: '', redirectTo: 'app', pathMatch: 'full'
},
{
  path: 'app', canActivate: [AppGuard], loadChildren: () => import('./layout/layout.module').then(module => module.LayoutModule)
}
];
