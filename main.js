const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    // Set up wallet
    const wallet = new ethers.Wallet("0x0000000000000000000000000000000000000000000000000000000000000001", ethers.provider);

    // Connect to token contracts
    const erc20_abi = [
            "function deposit() payable",
            "function withdraw(uint wad)",
            "function balanceOf(address owner) view returns (uint balance)",
            "function approve(address spender, uint256 value) returns (bool success)",
            "function transfer(address to, uint256 value) returns (bool success)",
    ];
    const wbtc = new ethers.Contract(
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
        erc20_abi,
        wallet
    );
    const weth = new ethers.Contract(
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        erc20_abi,
        wallet
    );

    console.log("Initial balances:");
    console.log("   ETH:", ethers.utils.formatUnits(await wallet.getBalance(), "ether"));
    console.log("   BTC:", ethers.utils.formatUnits(await wbtc.balanceOf(wallet.address), 8));
    console.log("");

    // Connect to uniswap router contract
    const router = new ethers.Contract(
        "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        [
            "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
            "function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
            "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)",
            "function getAmountsIn(uint amountOut, address[] memory path) view returns (uint[] memory amounts)",
        ],
        wallet
    );

    // Execute swap
    const path = [weth.address,wbtc.address];
    const weth_in = ethers.utils.parseUnits("1.0", "ether");
    const wbtc_out = await router.getAmountsOut(weth_in, path);
    await weth.deposit({ value: weth_in });
    await weth.approve(router.address, weth_in);
    await router.swapExactTokensForTokens(weth_in, wbtc_out[1], path, wallet.address, Date.now()+10000);

    console.log("After swapping ETH", ethers.utils.formatUnits(weth_in, "ether"), "to BTC:");
    console.log("   ETH:", ethers.utils.formatUnits(await wallet.getBalance(), "ether"));
    console.log("   BTC:", ethers.utils.formatUnits(await wbtc.balanceOf(wallet.address), 8));
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });