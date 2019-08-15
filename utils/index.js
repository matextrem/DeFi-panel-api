const cTokens = {
    'DAI': { address: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14" },
    'USDC': {
        address: "0x5b281a6dda0b271e91ae35de655ad301c976edb1"
    }
}
const ERC20 = {
    'DAI': { address: "0xef77ce798401dac8120f77dc2debd5455eddacf9", marketId: 1, decimals: 18 },
    'USDC': { address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", marketId: 2, decimals: 6 }
}

const rates = {
    'DAI': { address: "0xf5dce57282a584d2746faf1593d3121fcac444dc" },
    'USDC': { address: "0x39aa39c021dfbae8fac545936693ac917d5e7563" }
}

module.exports = {
    cTokens,
    ERC20,
    rates
};