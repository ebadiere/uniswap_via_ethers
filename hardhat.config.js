require("@nomiclabs/hardhat-ethers");
const ethers = require("ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/DVpmcvUl_q1xA0qb8XGERXNVkZSshJHB",
        blockNumber: 14079555,
      },
      accounts: [
        {
          privateKey: "0x0000000000000000000000000000000000000000000000000000000000000001",
          balance: ethers.utils.parseUnits("10.0","ether").toString(),
        },
      ],
    },
  }
};
