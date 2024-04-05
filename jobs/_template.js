
// jobs definem quando os scripts devem ser executados
const schedule = require('node-schedule')

/**
 * For setting up a recurrence rule see:
 * https://www.npmjs.com/package/node-schedule#recurrence-rule-scheduling 
 */

const rule = new schedule.RecurrenceRule()

/**
 * For how to set a time for execution, see:
 * https://www.npmjs.com/package/node-schedule#recurrencerule-properties
 * 
 * Note that ChatGPT can be helpful in giving you
 * the rule you need.
 */

rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const templateJob = schedule.scheduleJob(rule, () => {
  const time = new Date();

  console.log(`Template job ran at ${time}\n`)
})

// Listen for shutdown
process.on('SIGINT', () => {
  schedule.gracefulShutdown()
    .then(() => process.exit(0))
})

