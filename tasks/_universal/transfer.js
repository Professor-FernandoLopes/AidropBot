require("hardhat/config")

/**
 * This script is for transferring the 
 * native token or a ERC20 token
 * between accounts.
 * 
 * Native tokens are the main token used
 * for gas fees on a network. The native 
 * token for Ethereum Mainnet is ETH, while
 * the native token for Polygon is MATIC.
 */

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

const transferDefinition = task("transfer", "Perform a transfer of tokens.")
  .addParam("type", "The type of transfer to perform")
  .addParam("account", "Account to perform the transfer")
  .setAction(async (taskArgs, hre) => {
    const [ACCOUNT_1, ACCOUNT_2] = await hre.ethers.getSigners()

    // Figure out account to use
    const sender = taskArgs.account === ACCOUNT_1.address ? ACCOUNT_1 : ACCOUNT_2
    const receiver = taskArgs.account === ACCOUNT_1.address ? ACCOUNT_2 : ACCOUNT_1

    switch (taskArgs.type) {
      case "1":
        // Transfer native token
        const ETH_TRANSFER_AMOUNT = hre.ethers.parseUnits("0.01", 18) // 0.01 ETH

        await transferETH(
          {
            sender: sender,
            receiver: receiver,
            amount: ETH_TRANSFER_AMOUNT
          })

        break
      case "2":
        // Transfer ERC20 token
        const ERC20_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
        const ERC20_TRANSFER_AMOUNT = hre.ethers.parseUnits("5", 18) // 5 DAI

        await transferERC20(
          {
            token: ERC20_ADDRESS,
            sender: sender,
            receiver: receiver,
            amount: ERC20_TRANSFER_AMOUNT
          })

        break
      default:
        console.log("\nPlease specify 1 or 2 for the swap type\n")
        break
    }
  })

/**
 * transferETH
 */

async function transferETH(details) {
  // Perform swap...
  transaction = await details.sender.sendTransaction({
    to: details.receiver.address,
    value: details.amount
  });

  // Wait for completion...
  await transaction.wait()

  console.log(`Transfer Complete!`)
  console.log(`Transaction hash: ${transaction.hash}\n`)

  // Log ETH balance...
  await logETHBalances(details.sender, details.receiver)
}

/**
 * swapERC20
 */

async function transferERC20(details) {
  // Get ERC20 token...
  const token = new hre.ethers.Contract(details.token, IERC20.abi, hre.ethers.provider)

  // Approve ERC20 for swapping...
  const transaction = await token.connect(details.sender).transfer(
    details.receiver.address,
    details.amount
  )

  // Wait for completion...
  await transaction.wait()

  console.log(`\nTransfer Complete!`)
  console.log(`Transaction hash: ${transaction.hash}\n`)

  // Log token balance...
  await logERC20Balances(token, details.sender, details.receiver)
}

/**
 * logETHBalance & logERC20Balance
 * Log sender and receiver's ETH balance
 * Log sender and receiver's ERC20 balance
 */

async function logETHBalances(sender, receiver) {
  const senderEtherBalance = await hre.ethers.provider.getBalance(sender)
  console.log(`Sender ETH Balance: ${hre.ethers.formatUnits(senderEtherBalance)}`)

  const receiverEtherBalance = await hre.ethers.provider.getBalance(receiver)
  console.log(`Receiver ETH Balance: ${hre.ethers.formatUnits(receiverEtherBalance)}`)
}

async function logERC20Balances(token, sender, receiver) {
  // Get token details
  const symbol = await token.symbol()
  const decimals = await token.decimals()

  const senderTokenBalance = await token.balanceOf(sender.address)
  console.log(`Sender ${symbol} Balance: ${hre.ethers.formatUnits(senderTokenBalance, decimals)}`)

  const receiverTokenBalance = await token.balanceOf(receiver.address)
  console.log(`Receiver ${symbol} Balance: ${hre.ethers.formatUnits(receiverTokenBalance, decimals)}`)
}

module.exports = {
  transferDefinition
}