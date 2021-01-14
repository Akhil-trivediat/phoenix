export const environment = {
    version: '1.1',
    production: false,
    isDebugMode: true,
    serverUrl: 'https://osikxsq11j.execute-api.us-east-2.amazonaws.com/dev',
    cognito: {
      region: 'us-east-2',
      userPoolId: 'us-east-2_unrHx3Foh',
      userPoolWebClientId: '7rh3thtkolmek6rn0d9v4ctpe2',
      redirectSignIn: 'http://localhost:4200/login',
      redirectSignOut: 'http://localhost:4200/login',
    },
    API: {
    },
    delayMaxLimit: 1440,
    snoozeMaxLimit: 1440,
  };