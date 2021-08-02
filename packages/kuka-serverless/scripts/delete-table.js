const { DynamoDB } = require("@aws-sdk/client-dynamodb")

;(async () => {
  const client = new DynamoDB({ region: process.env.REGION })
  const params = {
    TableName: process.env.TABLE_NAME + "-" + process.env.STAGE,
  }
  await client.deleteTable(params)
})()
