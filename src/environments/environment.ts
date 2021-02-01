// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  cognito: {
    identityPoolId: 'us-east-2:612bd680-b911-4899-9018-8941de837d7c', 
    region: 'us-east-2', 
    userPoolId: 'us-east-2_unrHx3Foh',
    userPoolWebClientId: '7rh3thtkolmek6rn0d9v4ctpe2', 
    redirectSignIn: '',
    redirectSignOut: ''
  },
};

// pheonix
// identityPoolId: 'us-east-2:612bd680-b911-4899-9018-8941de837d7c', 
// region: 'us-east-2', 
// userPoolId: 'us-east-2_unrHx3Foh',
// userPoolWebClientId: '7rh3thtkolmek6rn0d9v4ctpe2', 

//pheonix amplify
// identityPoolId: 'us-east-2:beedc56c-b232-4704-9dd2-4281a417950a',
// region: 'us-east-2',
// userPoolId: 'us-east-2_NbvaYwLh8',
// userPoolWebClientId: '2t4kovjiorn54m6jt98c8qoaae',

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
