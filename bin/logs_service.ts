import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as glue from "@aws-cdk/aws-glue";
import * as athena from "@aws-cdk/aws-athena";

export class LogsService extends core.Construct
{
  constructor(scope: core.Construct, id: string)
  {
    super(scope, id);

    const logsBucket = new s3.Bucket(this, "LogsStore");
    const queriesBucket = new s3.Bucket(this, "QueriesStore");
    const glueDb = new glue.Database(
      this,
      'logs-glue-db',
      {
        databaseName: 's3-logs-db'
      });
    
    const glueTable = new glue.Table(
      this,
      'logs_table',
      {
        tableName: 'logs_table',
        columns: [
          {
            name: 'time',
            type: {
              inputString: "string",
              isPrimitive: true
            }
          },
          {
            name: 'product',
            type: {
              inputString: "string",
              isPrimitive: true
            }
          },
          {
            name: 'client_id',
            type: {
              inputString: "string",
              isPrimitive: true
            }
          },
          {
            name: 'message',
            type: {
              inputString: "string",
              isPrimitive: true
            }
          },
          {
            name: 'data',
            type: {
              inputString: "string",
              isPrimitive: true
            }
          },
        ],
        database: glueDb,
        bucket: logsBucket,
        dataFormat: glue.DataFormat.CSV
      }
    )

    const athenaWorkgroup = new athena.CfnWorkGroup(
      this,
      'logs-athena-workgroup',
      {
        name: 'logs-athena-query-workgroup',
        description: 'Athena workgroup to query stored logs',
        state: 'ENABLED',

      }
    )

    const handler = new lambda.Function(this, "LogsHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "logs.main",
      environment: {
        BUCKET: logsBucket.bucketName
      }
    });

    logsBucket.grantReadWrite(handler); // was: handler.role);

    const api = new apigateway.RestApi(this, "logs-api", {
      restApiName: "Logs Service",
      description: "This service save log files."
    });

    const postLogsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("POST", postLogsIntegration);
  }
}