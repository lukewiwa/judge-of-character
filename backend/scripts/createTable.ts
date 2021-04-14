import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomInt } from "crypto";
import {
  TABLE_DETAILS,
  TABLE_NAME,
  SCORE,
  SCORE_DATETIME,
  USERNAME,
  GAME_MODE,
  INDEX_NAME,
  DDBConfig,
} from "../config";

(async () => {
  const client = new DynamoDBClient(DDBConfig);
  const command = new CreateTableCommand(TABLE_DETAILS);

  try {
    const deleteTable = new DeleteTableCommand({
      TableName: TABLE_NAME,
    });
    await client.send(deleteTable);
  } catch (err) {
    console.log("No table to delete:", JSON.stringify(err, null, 2));
  }
  try {
    const data = await client.send(command);
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
    [...Array(2)].forEach(async (_, i) => {
      const score = randomInt(0, 100);
      const datetime = new Date(Date.now()).toISOString();
      const putItem = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({
          [USERNAME]: `user${i}`,
          [SCORE]: score,
          [SCORE_DATETIME]: datetime,
          [GAME_MODE]: "regular",
        }),
      });
      await client.send(putItem);
    });
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
      ProjectionExpression: `${USERNAME}, ${SCORE}, ${SCORE_DATETIME}`,
    });
    try {
      const results = await client.send(getTable);
      const { Items = [] } = results;
      const printable = Items.map((item) => unmarshall(item));
      console.log("Table", JSON.stringify(printable, null, 2));
    } catch (err) {
      console.log("can't read table:", err);
    }
  } catch (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  }
})();
