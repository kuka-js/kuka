const { DynamoDB } = require("@aws-sdk/client-dynamodb")

;(async () => {
  const client = new DynamoDB({ region: process.env.REGION })
  const params = {
    TableName: process.env.TABLE_NAME + "-" + process.env.STAGE,
    GlobalSecondaryIndexUpdates: {
      Create: {
        IndexName: "email-pk-index",
        KeySchema: [
          { AttributeName: "email", KeyType: "HASH" },
          { AttributeName: "pk", KeyType: "RANGE" },
        ],
        Projection: "ALL",
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    },
  }
  await client.updateTable(params)
})()
