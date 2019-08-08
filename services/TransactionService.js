const utils = require('../utils');
const web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction


require('dotenv').config();


const set = async (web3js, value, token) => {
    //creating contracts object
    // web3js.eth.personal.unlockAccount(process.env.MY_ADDRESS, "juanroman10", 600);

    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');
    const CTokenContract = new web3js.eth.Contract(utils.cTokens[token].ABI, utils.cTokens[token].address);
    const ERC20Contract = new web3js.eth.Contract(utils.ERC20.ABI, utils.ERC20[token].address);

    // get transaction count, later will used as nonce
    let count = await web3js.eth.getTransactionCount(process.env.MY_ADDRESS);
    console.log(count, "count");
    let data = await ERC20Contract.methods.approve(utils.cTokens[token].address, Number(value)).encodeABI();
    const rawTransaction = {
        nonce: web3js.utils.toHex(count),
        from: process.env.MY_ADDRESS,
        gasPrice: web3js.utils.toHex(20 * 1e9),
        gasLimit: web3js.utils.toHex(210000),
        to: utils.ERC20[token].address,
        value: "0x0",
        data
    };
    const tx = new EthereumTx(rawTransaction, { chain: process.env.SELECTED_NETWORK, hardfork: 'petersburg' });
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    //sending transacton via web3js module
    await web3js.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    count = await web3js.eth.getTransactionCount(process.env.MY_ADDRESS);
    console.log(count, "count");
    data = await CTokenContract.methods.mint(Number(value)).encodeABI();
    const rawTransaction1 = {
        nonce: web3js.utils.toHex(count),
        from: process.env.MY_ADDRESS,
        gasPrice: web3js.utils.toHex(20 * 1e9),
        gasLimit: web3js.utils.toHex(210000),
        value: "0x0",
        to: utils.cTokens[token].address,
        data
    };
    const tx1 = new EthereumTx(rawTransaction1, { chain: process.env.SELECTED_NETWORK, hardfork: 'petersburg' });
    tx1.sign(privateKey);
    const serializedTx1 = tx1.serialize();

    //sending transacton via web3js module
    return await web3js.eth.sendSignedTransaction('0x' + serializedTx1.toString('hex'));
    //await ERC20Contract.methods.approve(utils.cTokens[token].address, Number(value)).send({ from: process.env.MY_ADDRESS });
}

const borrow = async (web3js, value, token) => {

}

const isAccountLocked = (web3, account) => {
    try {
        web3.eth.sendTransaction({
            from: account,
            to: account,
            value: 0
        });
        return false;
    } catch (err) {
        return (err.message == "authentication needed: password or unlock");
    }
}


module.exports = {
    set,
    borrow
};