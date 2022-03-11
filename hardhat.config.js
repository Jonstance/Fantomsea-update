require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();



module.exports = {
  networks:{
    hardhat:{
      chainId: 1337
    },
    testnet:{
      url: "https://rpc.testnet.fantom.network/",
      accounts: [privateKey]
    },
    mainnet:{
      url: "https://rpcapi.fantom.network/",
      accounts: [privateKey]
    },
  },
  solidity: "0.8.4",
};
