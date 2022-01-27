# Uniswap via ethers.js

Basic example of how to swap tokens using Uniswap and ethers.js. Runs in a local fork of the Ethereum mainnet and is hence 100% free and reproducible. To run the code, copy-paste the following to your terminal:

```
npm install
npx hardhat run main.js
```

If everything goes to plan, you should see the following output:

```
Initial balances:
   ETH: 10.0
   BTC: 0.0

After swapping ETH 1.0 to BTC:
   ETH: 8.983895712054130944
   BTC: 0.06563619
```