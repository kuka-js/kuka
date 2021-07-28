const { APIGateway } = require("@aws-sdk/client-api-gateway")

;(async () => {
  const client = new APIGateway({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.APIGW_KEY,
      secretAccessKey: process.env.APIGW_SECRET,
    },
  })
  const params = {}
  const result = await client.getRestApis(params)
  const apiId = result.items.filter((item) => {
    return item.name == "ci-kuka-js"
  })[0].id
  console.log(apiId)
})()
