const utils = require('../utils');
const web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;
const { Solo, AmountReference, AmountDenomination, ConfirmationType } = require('@dydxprotocol/solo');
const BigNumber = require('bignumber.js');


require('dotenv').config();

const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');


const setData = async (web3, value, token) => {
    //creating contracts object
    const CTokenContract = new web3.eth.Contract(utils.cTokens[token].ABI, utils.cTokens[token].address);
    const ERC20Contract = new web3.eth.Contract(utils.ERC20.ABI, utils.ERC20[token].address);
    const tokenDecimals = utils.ERC20[token].decimals;
    const amount = (Number(value) * Math.pow(10, tokenDecimals)).toString();
    const data = await ERC20Contract.methods.approve(utils.cTokens[token].address, amount).encodeABI();
    await getTransactionSigned(web3, data, utils.ERC20[token].address, privateKey);
    return { CTokenContract, amount };
}

const mint = async (web3js, value, token, protocol) => {
    let response = {};
    switch (protocol) {
        case 'compound':
            response = await mintCompound(web3js, value, token);
            break;
        case 'dydx':
            response = await mintDyDx(web3js, value, token);
            break;
        default:
            break;
    }

    return response;

}

const mintDyDx = async (provider, value, token) => {
    const tokenDecimals = utils.ERC20[token].decimals;
    const amount = (Number(value) * Math.pow(10, tokenDecimals)).toString();
    const solo = new Solo(provider, process.env.SELECTED_NETWORK_ID);
    const operation = solo.operation.initiate();
    operation.deposit({
        primaryAccountOwner: process.env.MY_ADDRESS,
        primaryAccountId: new BigNumber('0'),
        marketId: new BigNumber(utils.ERC20[token].marketId),
        amount: {
            value: new BigNumber(amount),
            reference: AmountReference.Delta,
            denomination: AmountDenomination.Actual,
        },
        from: process.env.MY_ADDRESS
    });
    const response = await operation.commit({
        from: process.env.MY_ADDRESS,
        gasPrice: '1000000000',
        confirmationType: ConfirmationType.Confirmed,
    });
}

const mintCompound = async (web3, value, token) => {
    const { CTokenContract, amount } = await setData(web3, value, token);
    const data = await CTokenContract.methods.mint(amount).encodeABI();
    return await getTransactionSigned(web3, data, utils.cTokens[token].address, privateKey);
}

const borrowCompound = async (web3, value, token) => {
    const { CTokenContract, amount } = await setData(web3, value, token);
    const data = await CTokenContract.methods.borrow(amount).encodeABI();
    return await getTransactionSigned(web3, data, utils.cTokens[token].address, privateKey);
}

const borrowDyDx = async () => { }

const borrow = async (web3js, value, token, protocol) => {
    let response = {};
    switch (protocol) {
        case 'compound':
            response = await borrowCompound(web3js, value, token);
            break;
        case 'dydx':
            response = await borrowDyDx();
            break;
        default:
            break;
    }

    return response;


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
    mint,
    borrow
};