export const environment = {
  version: '1.1',
  production: true,
  isDebugMode: true,
  serverUrl: 'https://pwpfhd9bla.execute-api.us-east-2.amazonaws.com/dev',
  cognito: {
    identityPoolId:'us-east-2:612bd680-b911-4899-9018-8941de837d7c',
    region: 'us-east-2',
    userPoolId: 'us-east-2_unrHx3Foh',
    userPoolWebClientId: '7rh3thtkolmek6rn0d9v4ctpe2',
    redirectSignIn: 'https://d2d51zr3pw564g.cloudfront.net',
    redirectSignOut: 'https://d2d51zr3pw564g.cloudfront.net',
  },
  API: {
  },
  delayMaxLimit: 1440,
  snoozeMaxLimit: 1440,
};