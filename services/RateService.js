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

const getAll = async (protocol = null) => {
    let rates = [];
    switch (protocol) {
        case 'compound':
            rates = await getAllCompoundsRates();
            break;
        case 'dydx':
            rates = await getAllDyDxRates();
            break;
        default:
            rates = await getAllRates();
            break;
    }
    return rates;
}

const getAllRates = async () => {
    const compoundRates = (await getAllCompoundsRates()).sort((a, b) => a.token.localeCompare(b.token));
    const dydxRates = (await getAllDyDxRates()).sort((a, b) => a.token.localeCompare(b.token));
    return [{ name: 'compound', rates: compoundRates }, { name: 'dydx', rates: dydxRates }];

}

const getAllCompoundsRates = async () => {
    const tokenDetails = await axios.get("https://api.compound.finance/api/v2/ctoken");
    const tokens = Object.keys(utils.cTokens);
    return tokenDetails.data.cToken
        .filter(token => tokens.includes(token.underlying_symbol))
        .map(token => {
            return {
                token: token.underlying_symbol,
                borrow_rate: (token.borrow_rate.value * 100).toFixed(2),
                supply_rate: (token.supply_rate.value * 100).toFixed(2)
            }
        })
}
const getAllDyDxRates = async () => {
    const tokenDetails = await axios.get("https://api.dydx.exchange/v1/markets");
    const tokens = Object.keys(utils.cTokens);
    return tokenDetails.data.markets
        .filter(market => tokens.includes(market.name))
        .map(market => {
            return {
                token: market.name,
                borrow_rate: (market.totalBorrowAPY * 100).toFixed(2),
                supply_rate: (market.totalSupplyAPY * 100).toFixed(2)
            }
        })
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
    get,
    getAll
};