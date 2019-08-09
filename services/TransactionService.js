const utils = require('../utils');
const web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

require('dotenv').config();

const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');


const setData = async (web3, value, token) => {
    //creating contracts object
    const CTokenContract = new web3.eth.Contract(utils.cTokens[token].ABI, utils.cTokens[token].address);
    const ERC20Contract = new web3.eth.Contract(utils.ERC20.ABI, utils.ERC20[token].address);
    const tokenDecimals = utils.cTokens[token].decimals;
    const amount = (Number(value) * Math.pow(10, tokenDecimals)).toString();
    const data = await ERC20Contract.methods.approve(utils.cTokens[token].address, amount).encodeABI();
    await getTransactionSigned(web3, data, utils.ERC20[token].address, privateKey);
    return { CTokenContract, amount };
}

const set = async (web3js, value, token) => {
    const { CTokenContract, amount } = await setData(web3js, value, token);
    const data = await CTokenContract.methods.mint(amount).encodeABI();
    return await getTransactionSigned(web3js, data, utils.cTokens[token].address, privateKey);
}

const borrow = async (web3js, value, token) => {
    const { CTokenContract, amount } = await setData(web3js, value, token);
    const data = await CTokenContract.methods.borrow(amount).encodeABI();
    return await getTransactionSigned(web3js, data, utils.cTokens[token].address, privateKey);
}

const getTransactionSigned = async (web3, data, to, privateKey) => {
    // get transaction count, later will used as nonce
    const count = await web3.eth.getTransactionCount(process.env.MY_ADDRESS);
    const rawTransaction = {
        nonce: web3.utils.toHex(count),
        from: process.env.MY_ADDRESS,
        gasPrice: web3.utils.toHex(20 * 1e9),
        gasLimit: web3.utils.toHex(400000),
        to,
        value: "0x0",
        data
    };
    const tx = new EthereumTx(rawTransaction, { chain: process.env.SELECTED_NETWORK, hardfork: 'petersburg' });
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    //sending transacton via web3js module
    return await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
}


module.exports = {
    set,
    borrow
};