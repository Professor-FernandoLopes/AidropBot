require("hardhat/config")

/**
 * This is an example template task
 * script.
 */

// Artifact imports here.
// ex. const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

const templateDefinition = task("template", "Description of Task")
  .addParam("account", "Account to perform the transfer")
  .setAction(async (taskArgs, hre) => {
    const [ACCOUNT_1, ACCOUNT_2] = await hre.ethers.getSigners()

    // Figure out account to use
    const account = taskArgs.account === ACCOUNT_1.address ? ACCOUNT_1 : ACCOUNT_2

    // Perform task

    /**
     * Here you can code out the main
     * logic of your task. 
     * 
     * You can look at the swap & transfer
     * task for a more detailed example.
     */

    console.log(`Perform task for ${account.address}`)

  })

/**
 * Create any utility or helper functions below.
 * Some examples could be like reading an account's
 * balance. Reference the swap & transfer script
 * for more examples.
 */

async function templateFunction() {
  console.log("do something in here?")
}

/**
 * Export the task
 */

module.exports = {
  templateDefinition
}