# Airdrop Hunter Masterclass
- DefiLlama 
- Coingecko
## Technology Stack & Tools
- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.org/v6/) (Blockchain Interaction)
- [Infura](https://www.infura.io/) (Blockchain Connection)
- [Node-Schedule](https://www.npmjs.com/package/node-schedule) (Cron Jobs)
- [PM2](https://www.npmjs.com/package/pm2) (Background Process Manager)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). We recommend using the latest LTS (Long-Term-Support) version, and preferably installing NodeJS via [NVM](https://github.com/nvm-sh/nvm#intro).
- Install [PM2](https://www.npmjs.com/package/pm2#installing-pm2) by executing `npm i -g pm2`
- Create an [Infura](https://www.infura.io/) account, and you'll need to create an API key for your account.

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Create and Setup .env
Before running any scripts, you'll want to create a .env file with the following values (see .env.example):

- **PRIVATE_KEY_1=""** (Private key of your 1st account to execute transactions)
- **PRIVATE_KEY_2=""** (Private key of your 2nd account to execute transactions)
- **INFURA_API_KEY=""**

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run Swap Tasks
In a separate terminal execute the following:
- `$ npx hardhat swap --type 1 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost`
- `$ npx hardhat swap --type 2 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost`

### 6. Run Transfer Tasks
- `$ npx hardhat transfer --type 1 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost`
- `$ npx hardhat transfer --type 2 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost`

### 7. Run Tasks w/ Other Account (Optional)
- `$ npx hardhat swap --type 1 --account 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network localhost`
- `$ npx hardhat swap --type 2 --account 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network localhost`
- `$ npx hardhat transfer --type 1 --account 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network localhost`
- `$ npx hardhat transfer --type 2 --account 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network localhost`

## Running a Job in the Background
### 1. Start or Restart the Hardhat Node
`$ npx hardhat node`

### 2. Start Job
`$ pm2 start jobs/localhost.js`

### 3. Monitoring Your Jobs
`$ pm2 monit`

### 4. View Running Applications (Optional)
`$ pm2 list`

### 5. Stop Job (Optional)
`$ pm2 stop jobs/localhost.js`

### 6. Delete Job (Optional)
`$ pm2 delete jobs/localhost.js`

## Anatomy of Tasks
By default the *tasks* folder has 3 folders
- *_universal*
- *arbitrum*
- *ethereum*

Inside of the *_universal* folder is where you can put tasks that may be universal for every EVM chain. An example of this would be transferring an ERC20 token or checking a balance of an account.

Ideally every other folder would be the name of the EVM chain and contain tasks that would relate to that specific EVM chain. So for example if you wanted to interact with an exchange only deployed on Arbitrum you'd put that task inside of the *arbitrum* folder.

If you want to build on zkSync for example, you could create a *zksync* folder and place your tasks for that EVM chain in there.

### Creating & Testing Your Tasks
Inside of the tasks folder you can see the template.js file which is a basic example of a hardhat task

If you are looking to test the tasks you've built, you can run it locally to make sure it behaves the way you want it to by appending `--network localhost` to the command. In the case you've built a task on a different EVM chain like Arbitrum, you'll need to replace the forking URL in your *hardhat.config.js* file to the EVM chain you wish to test:

```
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
```

## Anatomy of Jobs
The *jobs* folder follows a similar structure to the *tasks* folder. By default it contains 3 scripts:
- *_template.js*
- *localhost.js*
- *sepolia.js*

The *_template.js* script is an example of a basic job using node-schedule. It executes the job every 5 minutes and console logs a basic message. You can use this as a starter point for other jobs you decide to create.

The *localhost.js* script is an example of transferring ETH and making a swap on the local hardhat node. We perform a swap every 5 minutes, and we transfer ETH every minute except for every 5th minute (to not conflict with the swap).

The *sepolia.js* script is an example of transferring ETH on the Sepolia testnet, this happens every 30 minutes.

If you wish to create a job for a different EVM chain, one of the approaches is by making a file that contains the jobs for that EVM chain. Let's say you built a task for zkSync and you want to run it as a cron job. You can create a zksync.js file inside of the jobs folder and place your jobs in there.

## Other Approaches
Below are some of the other approaches for running your tasks:

### Running Tasks Manually
Of course you may not always want to run your tasks as a job and may want to run it a few times every once in a while. In that case, it may be more favorable to just execute the command as you wish.

### Utilizing a Shell Script
Similar to running tasks manually from your command line. You can create a shell script which will execute multiple tasks in order in 1 command. For example, you could create a localhost.sh file in your project that contains:

```
npx hardhat transfer --type 1 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost
npx hardhat swap --type 1 --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost

echo "Tasks Completed!"
```

Then you can execute `./localhost.sh` in your terminal.

### Using a Jobs Service like AWS Lambda
If you want a more sophisticated approach, you can use a service like AWS Lambda & Serverless to run your tasks at a scheduled time. Note that this will require you to store private keys and API keys on their services in addition to potential costs for running your functions. 
