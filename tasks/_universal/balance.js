require("hardhat/config")

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

const DEFAULT_ERC20 = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

const balanceDefinition = task("balance", "Get an account's balance")
  .addParam("type", "1 for native token balance or 2 for an ERC20 balance")
  .addParam("account", "The account's address")
  .addOptionalParam("contract", "The ERC20 contract to use", DEFAULT_ERC20)
  .setAction(async (taskArgs, hre) => {
    let balance

    switch (taskArgs.type) {
      case "1":
        // Get native token balance
        balance = await hre.ethers.provider.getBalance(taskArgs.account)

        console.log(`${hre.ethers.formatUnits(balance)} ETH`)
        break
      case "2":
        // Swap ERC20 token balance
        const token = new hre.ethers.Contract(taskArgs.contract, IERC20.abi, hre.ethers.provider)
        const symbol = await token.symbol()

        balance = await token.balanceOf(ACCOUNT_1.address)

        console.log(`${symbol} Balance: ${hre.ethers.formatUnits(balance, await token.decimals())}\n`)
        break
      default:
        console.log("Please specify 1 or 2 for the type\n")
        break
    }
  });

module.exports = {
  balanceDefinition
}