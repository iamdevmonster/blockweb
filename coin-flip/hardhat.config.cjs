require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    mumbai: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/yksW6m3QulK7gkZLBxs-sh5Ni1pJCYiF",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
