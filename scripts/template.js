// Import Hardhat for access to Hardhat tools & ethers v6
const hre = require("hardhat")

async function main() {
    const [ACCOUNT_1, ACCOUNT_2] = await hre.ethers.getSigners()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
