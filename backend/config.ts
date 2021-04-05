import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME ?? false;

const ENDPOINT = process.env.ENDPOINT ?? false;

const DDBConfig: DynamoDBClientConfig = {};
if (ENDPOINT) {
  DDBConfig.endpoint = ENDPOINT;
}

export { AWS_LAMBDA_FUNCTION_NAME, DDBConfig };
