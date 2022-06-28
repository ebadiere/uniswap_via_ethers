require('dotenv').config();

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    // Set up wallet
    const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545/`);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Connect to token contracts
    const erc20_abi = [
            "function deposit() payable",
            "function withdraw(uint wad)",
            "function balanceOf(address owner) view returns (uint balance)",
            "function approve(address spender, uint256 value) returns (bool success)",
            "function transfer(address to, uint256 value) returns (bool success)",
    ];
    const shib = new ethers.Contract(
        "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
        erc20_abi,
        wallet
    );
    const wmatic = new ethers.Contract(
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        erc20_abi,
        wallet
    );

    console.log("Initial balances:");
    console.log("   MATIC:", ethers.utils.formatUnits(await wallet.getBalance(), "ether"));
    console.log("   SHIB:", ethers.utils.formatUnits(await shib.balanceOf(wallet.address), 8));
    console.log("");

    // Connect to uniswap router contract
    const router = new ethers.Contract(
        "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        [
            "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
            "function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
            "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)",
            "function getAmountsIn(uint amountOut, address[] memory path) view returns (uint[] memory amounts)",
        ],
        wallet
    );

    // Execute swap
    const path = [wmatic.address,shib.address];
    const wmatic_in = ethers.utils.parseUnits("1.0", "ether");
    const shib_out = await router.getAmountsOut(wmatic_in, path);
    await wmatic.deposit({ value: wmatic_in });
    await wmatic.approve(router.address, wmatic_in);
    await router.swapExactTokensForTokens(wmatic_in, shib_out[1], path, wallet.address, Date.now()+10000);

    console.log("After swapping MATIC", ethers.utils.formatUnits(wmatic_in, "ether"), "to SHIB:");
    console.log("   MATIC:", ethers.utils.formatUnits(await wallet.getBalance(), "ether"));
    console.log("   SHIB:", ethers.utils.formatUnits(await shib.balanceOf(wallet.address), 18));
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });