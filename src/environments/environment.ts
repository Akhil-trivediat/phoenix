// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// ************* US-EAST-1 ************* //
export const environment = {
  production: false,
  serverUrl: 'https://pwpfhd9bla.execute-api.us-east-2.amazonaws.com/dev',
  iotEndpoint: 'wss://a229t6it5tss-ats.iot.us-east-1.amazonaws.com/mqtt',
  iotPolicy: 'phx_myIoTPolicy',
  cognito: {
    identityPoolId: 'us-east-1:c2185d3f-009f-466b-bf4f-a98b935b391e', 
    region: 'us-east-1', 
    userPoolId: 'us-east-1_5dPwiDbcD',
    userPoolWebClientId: '3bf05k47305ragv21frhqbmmct', 
    redirectSignIn: '',
    redirectSignOut: ''
  },
};


// ************* US-EAST-2 ************* //
// export const environment = {
//   production: true,
//   cognito: {
//     identityPoolId: 'us-east-2:612bd680-b911-4899-9018-8941de837d7c', 
//     region: 'us-east-2', 
//     userPoolId: 'us-east-2_unrHx3Foh',
//     userPoolWebClientId: '7rh3thtkolmek6rn0d9v4ctpe2', 
//     redirectSignIn: '',
//     redirectSignOut: ''
//   },
// };