import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  AWS_LAMBDA_FUNCTION_NAME,
  DDBConfig,
  TABLE_NAME,
  SCORE,
  SCORE_DATETIME,
  USERNAME,
  GAME_MODE,
  INDEX_NAME,
} from "./config";
import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const app = express();
app.use(express.json());
app.use(cors());

const client = new DynamoDBClient(DDBConfig);

app.get("/scores", async (req, res) => {
  const getTable = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: INDEX_NAME,
    ScanIndexForward: false,
    Limit: 10,
    KeyConditionExpression: `${GAME_MODE} = :gamemode and ${SCORE} >= :score`,
    ExpressionAttributeValues: {
      ":score": { N: "0" },
      ":gamemode": { S: "regular" },
    },
    ProjectionExpression: `${USERNAME}, ${SCORE}`,
  });
  try {
    const { Items = [] } = await client.send(getTable);
    const data = Items.map((item) => unmarshall(item));
    res.json({ data });
  } catch (err) {
    console.error(err);
  }
});

app.post("/scores", async (req, res) => {
  const { Username, Score } = req.body;
  const scoreEntry = marshall({
    [USERNAME]: Username,
    [SCORE]: Score,
    [SCORE_DATETIME]: new Date(Date.now()).toISOString(),
    [GAME_MODE]: "regular",
  });

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: scoreEntry,
  });
  try {
    const results = await client.send(command);
    res.json({ data: results });
  } catch (err) {
    console.log(err);
  }
});

if (!AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(4000, () => console.log("app listening on port 4000!"));
}

const serverlessHandler = serverless(app);
export const handler: APIGatewayProxyHandlerV2 = async (event, context) =>
  await serverlessHandler(event, context);
