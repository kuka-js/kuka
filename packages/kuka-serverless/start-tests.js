const Tail = require("tail").Tail
const spawn = require("child_process").spawn

tail = new Tail("/tmp/sls-offline.log", { fromBeginning: true })

tail.on("line", function (data) {
  // Check when serverless offline is ready to start tests
  if (/server ready/.test(data.toString())) {
    // Start tests
    startTests()
  }
})

tail.on("error", function (error) {
  console.log("ERROR: ", error)
})

function startTests() {
  let spawnProcess = spawn(
    process.cwd() + "/node_modules/newman/bin/newman.js",
    [
      "run",
      ".newman/postman_collection.json",
      "-e",
      ".newman/postman_environment.json",
      "--verbose",
    ]
  )
  spawnProcess.stdout.on("data", async function (msg) {
    console.log(msg.toString())
  })
  spawnProcess.stderr.on("data", async function (msg) {
    console.error(msg.toString())
  })
}
