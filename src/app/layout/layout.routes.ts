import { Routes, RouterModule } from '@angular/router';
import { Layout } from './layout.component';
import { ResetPasswordComponent } from '../shared/component/reset-password/reset-password.component';
import { DeviceRegistrationComponent } from '../pages/devices/device-registration/device-registration.component';

const routes: Routes = [
  {
    path: '', component: Layout, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('../pages/dashboard/dashboard.module').then(module => module.DashboardComponentModule) },
      { path: 'main', loadChildren: () => import('../pages/main/main.module').then(module => module.MainModule) },
      { path: 'users', loadChildren: () => import('../pages/account/users/users.module').then(module => module.UsersModule) },
      { path: 'scrolling', loadChildren: () => import('../pages/scroller/scroller.module').then(module => module.ScrollerModule) },
      { path: 'profile', loadChildren: () => import('../pages/account/profile/profile.module').then(module => module.ProfileModule) },
      { path: 'devices', loadChildren: () => import('../pages/devices/device.module').then(module => module.DevicesComponentModule) },
      { path: 'sensor', loadChildren: () => import('../pages/sensor/sensor.module').then(module => module.SensorComponentModule) },
      { path: 'gateway', loadChildren: () => import('../pages/gateways/gateway.module').then(module => module.GatewayComponentModule) },
      { path: 'dataconnector', loadChildren: () => import('../pages/data-connector/data-connector.module').then(module => module.DataConnectorModule) },
      { path: 'AIInsight', loadChildren: () => import('../pages/ai-insights-reports/ai-insights-reports.module').then(module => module.AIInsightsReportsModule) },
      { path: 'help', loadChildren: () => import('../pages/help/help.module').then(module => module.HelpModule) },
      { path: 'notifications', loadChildren: () => import('../pages/notifications/notifications.module').then(module => module.NotificationsModule) },
      { path: 'apidocumentation', loadChildren: () => import('../pages/api-documentation/api-documentation.module').then(module => module.APIDocumentationModule) },
      { path: 'resetPassword', component: ResetPasswordComponent },
      {
        path: 'registerDevice', component: DeviceRegistrationComponent
      }

    ]
  }
];

export const ROUTES = RouterModule.forChild(routes);
