import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME ?? false;

const ENDPOINT = process.env.ENDPOINT ?? false;

const DDBConfig: DynamoDBClientConfig = {};
if (ENDPOINT) {
  DDBConfig.endpoint = ENDPOINT;
}

const TABLE_NAME = "Leaderboard";
const INDEX_NAME = "LeaderboardTopScores";
const USERNAME = "Username";
const SCORE = "Score";
const GAME_MODE = "GameMode";
const SCORE_DATETIME = "ScoreDatetime";

const TABLE_DETAILS = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: USERNAME, KeyType: "HASH" },
    { AttributeName: SCORE_DATETIME, KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: USERNAME, AttributeType: "S" },
    { AttributeName: SCORE_DATETIME, AttributeType: "S" },
    { AttributeName: SCORE, AttributeType: "N" },
    { AttributeName: GAME_MODE, AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: INDEX_NAME,
      KeySchema: [
        { AttributeName: GAME_MODE, KeyType: "HASH" },
        { AttributeName: SCORE, KeyType: "RANGE" },
      ],
      Projection: {
        ProjectionType: "INCLUDE",
        NonKeyAttributes: [USERNAME],
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

export {
  DDBConfig,
  AWS_LAMBDA_FUNCTION_NAME,
  TABLE_NAME,
  INDEX_NAME,
  USERNAME,
  SCORE,
  GAME_MODE,
  SCORE_DATETIME,
  TABLE_DETAILS,
};
