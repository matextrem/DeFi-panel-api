var axios = require('axios');
var utils = require('../utils');

const get = async (token, protocol) => {
    let tokenRate = {};
    switch (protocol) {
        case 'compound':
            tokenRate = await getCompoundRate(token);
            break;
        case 'dydx':
            tokenRate = await getDyDxRate(token);
            break;
        default:
            break;
    }

    return tokenRate;
}

const getCompoundRate = async token => {
    const tokenDetails = await axios.get(`https://api.compound.finance/api/v2/ctoken?addresses[]=${utils.rates[token].address}`);
    const response = tokenDetails.data.cToken[0];
    return {
        borrow_rate: (response.borrow_rate.value * 100).toFixed(2),
        supply_rate: (response.supply_rate.value * 100).toFixed(2),
        exchange_rate: (response.exchange_rate.value * 100).toFixed(2)
    }

}

const getDyDxRate = async token => {
    const tokenDetails = await axios.get("https://api.dydx.exchange/v1/markets");
    const response = tokenDetails.data.markets.find(market => market.name === token);
    return {
        borrow_rate: (response.totalSupplyAPY * 100).toFixed(2),
        supply_rate: (response.totalBorrowAPY * 100).toFixed(2)
    }
}

module.exports = {
    get
};