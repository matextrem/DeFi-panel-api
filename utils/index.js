const ABIS = require('../contracts');
const cTokens = {
    'DAI': { address: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14", ABI: ABIS.DAI },
    'USDC': { address: "0x39aa39c021dfbae8fac545936693ac917d5e7563", ABI: ABIS.USDC }
}
const ERC20 = {
    'DAI': { address: "0xef77ce798401dac8120f77dc2debd5455eddacf9" },
    'USDC': { address: "0x30c50d14858e3f285405b534bd41e11dd4fecd75" },
    ABI: ABIS.ERC20
}

module.exports = {
    cTokens,
    ERC20
};