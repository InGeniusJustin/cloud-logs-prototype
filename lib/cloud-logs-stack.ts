import * as cdk from '@aws-cdk/core';
import * as logs_service from '../bin/logs_service';

export class CloudLogsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new logs_service.LogsService(this, 'Logs');
  }
}
