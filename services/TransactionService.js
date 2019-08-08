const utils = require('../utils');
const web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction


require('dotenv').config();


const set = async (web3js, value, token) => {
    //creating contracts object
    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');
    const CTokenContract = new web3js.eth.Contract(utils.cTokens[token].ABI, utils.cTokens[token].address);
    const ERC20Contract = new web3js.eth.Contract(utils.ERC20.ABI, utils.ERC20[token].address);

    // get transaction count, later will used as nonce
    const count = await web3js.eth.getTransactionCount(process.env.MY_ADDRESS);
    const rawTransaction = {
        nonce: web3js.utils.toHex(count),
        from: process.env.MY_ADDRESS,
        gasPrice: web3js.utils.toHex(20 * 1e9),
        gasLimit: web3js.utils.toHex(210000)
    };
    const tx = new EthereumTx(rawTransaction, { chain: process.env.SELECTED_NETWORK, hardfork: 'petersburg' });
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    //sending transacton via web3js module
    web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    await ERC20Contract.methods.approve(utils.cTokens[token].address, Number(value)).call();
    return await CTokenContract.methods.mint(Number(value)).call();
}

const borrow = async (web3js, value, token) => {

}

module.exports = {
    set,
    borrow
};