require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox")

require("./tasks/_universal/balance")
require("./tasks/_universal/transfer")
require("./tasks/ethereum/swap")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      /**
       * By default we are forking the Ethereum Mainnet. If you want
       * to test with a different forked network, you'll want to
       * change out the URL
       */

      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      }
    },

   /*
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY_1, process.env.PRIVATE_KEY_2],
    },

    // Ethereum Mainnet
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY_1, process.env.PRIVATE_KEY_2],
    },

    // Arbitrum Mainnet
    arbitrum: {
      url: `https://arb1.arbitrum.io/rpc`,
      accounts: [process.env.PRIVATE_KEY_1, process.env.PRIVATE_KEY_2],
    }
    */
  },
};
