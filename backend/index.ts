import serverless from "serverless-http";
import express from "express";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { AWS_LAMBDA_FUNCTION_NAME, DDBConfig } from "./config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const app = express();
const client = new DynamoDBClient(DDBConfig);

app.get("/leaderboard", async (req, res) => {
  res.json({ hello: "world!" });
});

if (!AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(4000, () => console.log("app listening on port 4000!"));
}

const serverlessHandler = serverless(app);
export const handler: APIGatewayProxyHandlerV2 = async (event, context) =>
  await serverlessHandler(event, context);
