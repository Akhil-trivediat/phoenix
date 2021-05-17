import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule  } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LoginService } from './pages/login/login.service';
import { AppRoutingModule } from './app.routes';
import { CheckAllService } from './layout/utils/services/check-all.service';
import { AppComponent } from './app.component';
import { AppGuard } from './app.guard';
import { AppInterceptor } from './app.interceptor';
import { AppConfig } from './app.config';
import { UtilsModule } from './utils/utils-module/utils.module';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { AppService } from './app.service';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResetPasswordComponent } from './shared/component/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { DialogComponent } from './pages/account/users/dialog/dialog.component';
import { NgxDialogComponent } from './shared/component/ngx-dialog/ngx-dialog.component';
import { FilterbarModelComponent } from './shared/component/filterbar-model/filterbar-model.component';
import { AlertComponentModule } from './shared/component/alert/alert.module';
import { SharedModule } from './shared/component/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { AutocompleteInputBarComponent } from './pages/dashboard/autocomplete-input-bar/autocomplete-input-bar.component';
import { FilterPipe } from './pages/dashboard/autocomplete-input-bar/filter.pipe';
import { DashboardComponentModule } from './pages/dashboard/dashboard.module';

const APP_PROVIDERS = [
  CheckAllService,
  AppGuard,
  AppConfig
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
  imports: [
    AmplifyAngularModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    ToastrModule.forRoot(),
    UtilsModule,
    NgxChartsModule,
    AlertComponentModule,
    SharedModule,
    DashboardComponentModule,
    ReactiveFormsModule,
    OverlayModule
  ],
  providers: [
    APP_PROVIDERS,
    AmplifyService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true
    },
    LoginService,
    AppService,
  ],
  entryComponents: [
    DialogComponent,
    NgxDialogComponent,
    FilterbarModelComponent,
    AutocompleteInputBarComponent
  ]
})
export class AppModule { }
