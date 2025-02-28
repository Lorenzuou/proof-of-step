// hardhat.config.js
require("@nomiclabs/hardhat-waffle");

module.exports = {
  paths: {
    artifacts: './src/artifacts',
  },
  solidity: "0.8.4",
  networks: { 
    chainId: 1337,

  }
};

