const {
  DynamoDBClient,
  UpdateTableCommand,
} = require("@aws-sdk/client-dynamodb")

;(async () => {
  const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
      AccessKeyId: process.env.AWS_KEY,
      SecretAccessKey: process.env.AWS_SECRET,
    },
  })
  const params = {
    TableName: process.env.TABLE_NAME + "-" + process.env.STAGE,
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: "email-pk-index",
          KeySchema: [
            { AttributeName: "email", KeyType: "HASH" },
            { AttributeName: "pk", KeyType: "RANGE" },
          ],
          Projection: "ALL",
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    ],
  }
  console.log("WWWWWWWWWWWWWWWWWWWWWw")
  console.log(params)
  console.log("WWWWWWWWWWWWWWWWWWWWWw")
  console.log(process.env)
  console.log("WWWWWWWWWWWWWWWWWWWWWw")
  const command = new UpdateTableCommand(params)
  try {
    await client.send(command)
  } catch (e) {
    console.error(e)
  }
})()
