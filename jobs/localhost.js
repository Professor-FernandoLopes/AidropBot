const { exec } = require('child_process')
const schedule = require('node-schedule')

/**
 * Setup our 2 rules for transferring & swapping
 */

const transferETHRule = new schedule.RecurrenceRule()
const swapETHForERC20Rule = new schedule.RecurrenceRule()

/**
 * Setup transfer job
 */

// Every minute
transferETHRule.second = 0

const transferETHJob = schedule.scheduleJob(transferETHRule, () => {
  // Prevent job from running on every 5th minute...
  if (new Date().getMinutes() % 5 === 0) {
    return
  }

  console.log("\nBeginning Transfer...\n")

  const COMMAND = "npx hardhat transfer --type 1 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost"

  exec(COMMAND,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
})

/**
 * Setup swap job
 */

// Every 5 minutes
swapETHForERC20Rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

const swapETHForERC20Job = schedule.scheduleJob(swapETHForERC20Rule, () => {
  console.log("\nBeginning Swap...\n")

  const COMMAND = "npx hardhat swap --type 1 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost"

  exec(COMMAND,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
})

// Listen for shutdown
process.on('SIGINT', () => {
  schedule.gracefulShutdown()
    .then(() => process.exit(0))
})

