const { exec } = require('child_process')
const schedule = require('node-schedule')

/**
 * Setup our rule for transferring ETH
 */

const transferETHRule = new schedule.RecurrenceRule()

/**
 * Setup transfer job
 */

// Every minute
transferETHRule.minute = new schedule.Range(0, 59, 30)

const transferETHJob = schedule.scheduleJob(transferETHRule, () => {
  console.log("\nBeginning Transfer...\n")

  const ACCOUNT = "0xFcd04b2bb2b1885D9Cc1c9dB23dF2Eb362Adc062"
  const COMMAND = `npx hardhat transfer --type 1 --account ${ACCOUNT} --network sepolia`

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