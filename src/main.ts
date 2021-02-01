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
      //domain: environment.cognito.domain,
      // scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: environment.cognito.redirectSignIn,
      redirectSignOut: environment.cognito.redirectSignOut
    },

    // // REQUIRED - Amazon Cognito Identity Pool ID
    // identityPoolId: 'us-east-2:beedc56c-b232-4704-9dd2-4281a417950a', 
    // // REQUIRED - Amazon Cognito Region
    // region: 'us-east-2', 
    // // OPTIONAL - Amazon Cognito User Pool ID
    // userPoolId: 'us-east-2_NbvaYwLh8',
    // // OPTIONAL - Amazon Cognito Web Client ID
    // userPoolWebClientId: '37kbm74v63g2gk5568dcq40sq5',
}
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
