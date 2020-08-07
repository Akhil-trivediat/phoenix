# PhoenixSpa

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Serverless Setup

#Prerequisites for serverless setup:

Install AWS CLI : https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

Install Serverless CLI : https://www.serverless.com/framework/docs/getting-started/

## Serverless Configuration :

serverless.yaml has the configuration to setup the AWS stack.

`serverless deploy` is the command used to create the stack for the first time.Just need to change the bucket name.

This command will create an s3 bucket, a cloudfront distribution and deploy the stack.

#Commands to deploy the code to S3 and Sync Cloudfront distribution :

Run these to Setup AWS credentials for now (keys should be managed in a better way): 

$ export AWS_ACCESS_KEY_ID="access_key" (To set the AWS KEY)

$ export AWS_SECRET_ACCESS_KEY="secret" (To set the AWS Secret)

sls s3sync (to push thee latest code to S3)

sls domainInfo (To check the domain)

serverless invalidateCloudFrontCache (To clear the Cloudfront cache)

# Deployed URL :

https://d2v9dcvq88eki2.cloudfront.net/#/app/main
