import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: environment.cognito.identityPoolId, 
    // REQUIRED - Amazon Cognito Region
    region: environment.cognito.region, 
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: environment.cognito.userPoolId,
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: environment.cognito.userPoolWebClientId, 
    oauth: {
      redirectSignIn: environment.cognito.redirectSignIn,
      redirectSignOut: environment.cognito.redirectSignOut
    },
  }
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
