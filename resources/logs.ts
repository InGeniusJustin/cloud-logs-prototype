import * as AWS from 'aws-sdk';
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET || "";

/* 
This code uses callbacks to handle asynchronous function responses.
It currently demonstrates using an async-await pattern. 
AWS supports both the async-await and promises patterns.
For more information, see the following: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/calling-services-asynchronously.html
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html 
*/
exports.main = async function(event:any, context:any) {
  try {
    const method = event.httpMethod;
    const body = JSON.parse(event.body);

    if (method === "POST") {
      // POST /name
      // Return error if we do not have a name
      if (!body) {
        return {
          statusCode: 400,
          headers: {},
          body: "All Parameters missing"
        };
      }
      if (!body.time) {
        return {
          statusCode: 400,
          headers: {},
          body: "Message time is missing"
        };
      }
      if (!body.logs) {
        return {
          statusCode: 400,
          headers: {},
          body: "Logs are missing"
        };
      }
      if (!body.product) {
        return {
          statusCode: 400,
          headers: {},
          body: "Logs are missing"
        };
      }
      if (!body.clientId) {
        return {
          statusCode: 400,
          headers: {},
          body: "Logs are missing"
        };
      }
      const fileName = `${body.time}-${body.product}-${body.clientId}.log`
      const data = (body.logs as ILogEntry[]).reduce((acc, cur) => acc + formatLogMessage(body.clientId, body.product, cur), "")
      const base64data = Buffer.from(data, 'binary');

      await S3.putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: base64data,
        ContentType: 'application/json'
      }).promise();

      return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(event.body)
      };
    }
    // We got something besides a GET, POST, or DELETE
    return {
      statusCode: 400,
      headers: {},
      body: "We only accept POST messages" 
    };
  } catch(error) {
    const body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: body
    }
  }
}

interface ILogEntry {
  time: string,
  message: string,
  data?: string,
}
function formatLogMessage(clientId: string, product: string, logEntry: ILogEntry) {
  return `${logEntry.time},${product},${clientId},"${logEntry.message}","${logEntry.data ? logEntry.data : ""}"\n`
}