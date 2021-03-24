# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


## Info
This repo stores logs in S3 and parses through them using Amazon Glue and Athena. The table structure is in the CDK code in `bin/logs_service.ts`. The code that insersts a log is in the lambda defined in `resources/logs.ts`. Good Luck