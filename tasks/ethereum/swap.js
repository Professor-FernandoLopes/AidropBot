require("hardhat/config")

/**
 * This script is for performing a basic
 * swap on Uniswap V2.
 * 
 * For this specific example we are using Uniswap V2 
 * on Ethereum mainnet and swapping the native 
 * token (ETH) for DAI. 
 * 
 * There are many different V2 like exchanges
 * on other EVM chains so you can use this
 * script as a template for other EVM 
 * chains (See README for more info).
 */
// atentar para os forks
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')

const swapDefinition = task("swap", "Perform a swap")
  .addParam("type", "The type of swap to perform")
  .addParam("account", "Account to perform the swap")
  .setAction(async (taskArgs, hre) => {
    const [ACCOUNT_1, ACCOUNT_2] = await hre.ethers.getSigners()

    // Figure out account to use
    const account = taskArgs.account === ACCOUNT_1.address ? ACCOUNT_1 : ACCOUNT_2

    // Create Uniswap's V2 router contract reference
    const V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    const v2Router = new hre.ethers.Contract(V2_ROUTER_ADDRESS, IUniswapV2Router02.abi, hre.ethers.provider)

    // Tokens to use (Uniswap uses WETH to represent ETH) 
    const ETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const ERC20_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

    // X amount of ETH to swap for ERC20 (type 1)
    const ETH_SWAP_AMOUNT = hre.ethers.parseUnits("0.01", 18) // 0.01 ETH

    // X amount of ERC20 to swap for ETH (type 2)
    const ERC20_SWAP_AMOUNT = hre.ethers.parseUnits("5", 18) // 5 DAI

    // Deadline for when swap must be completed
    const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 10 // 10 minutes

    switch (taskArgs.type) {
      case "1":
        // Swap ETH for ERC20
        await swapETH(
          {
            router: v2Router,
            account: account,
            path: [ETH_ADDRESS, ERC20_ADDRESS],
            amount: ETH_SWAP_AMOUNT,
            deadline: DEADLINE
          })

        break
      case "2":
        // Swap ERC20 for ETH
        await swapERC20(
          {
            router: v2Router,
            account: account,
            path: [ERC20_ADDRESS, ETH_ADDRESS],
            amount: ERC20_SWAP_AMOUNT,
            deadline: DEADLINE
          })
        break
      default:
        console.log("\nPlease specify 1 or 2 for the swap type\n")
        break
    }
  })

/**
 * swapETH
 */

async function swapETH(trade) {
  // Perform swap...
  const transaction = await trade.router.connect(trade.account).swapExactETHForTokens(
    0,
    trade.path,
    trade.account.address,
    trade.deadline,
    { value: trade.amount }
  )

  // Wait for completion...
  await transaction.wait()

  console.log(`\nSwap Complete!`)
  console.log(`Transaction hash: ${transaction.hash}\n`)

  // Get ERC20 token...
  const token = new hre.ethers.Contract(trade.path[1], IERC20.abi, hre.ethers.provider)
  await logBalances(token, trade.account)
}

/**
 * swapERC20
 */

async function swapERC20(trade) {
  // Get ERC20 token...
  const token = new hre.ethers.Contract(trade.path[0], IERC20.abi, hre.ethers.provider)

  // Approve ERC20 for swapping...
  const approveTransaction = await token.connect(trade.account).approve(
    await trade.router.getAddress(),
    trade.amount
  )

  // Wait for completion...
  await approveTransaction.wait()

  // Perform swap...
  const transaction = await trade.router.connect(trade.account).swapExactTokensForETH(
    trade.amount,
    0,
    trade.path,
    trade.account.address,
    trade.deadline
  )

  // Wait for completion...
  await transaction.wait()

  console.log(`Swap Complete!`)
  console.log(`Transaction hash: ${transaction.hash}\n`)

  await logBalances(token, trade.account)
}

/**
 * logBalances
 * Console log user's ETH & ERC20 balance
 */

async function logBalances(token, account) {
  const etherBalance = await hre.ethers.provider.getBalance(account)
  console.log(`ETH Balance: ${hre.ethers.formatUnits(etherBalance)}`)

  const tokenBalance = await token.balanceOf(account.address)
  console.log(`${await token.symbol()} Balance: ${hre.ethers.formatUnits(tokenBalance, await token.decimals())}`)
}

module.exports = {
  swapDefinition
}