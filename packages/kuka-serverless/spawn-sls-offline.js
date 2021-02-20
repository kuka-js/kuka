const spawn = require("child_process").spawn;

let spawnProcess = spawn(
  process.cwd() + "/node_modules/serverless/bin/serverless.js",
  ["offline", "start", "--env", "test"]
);
spawnProcess.stdout.on("data", async function (msg) {
  if (/server ready/.test(msg.toString())) {
    process.exit(0);
  }
});
