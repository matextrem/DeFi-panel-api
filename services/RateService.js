var axios = require('axios');
var utils = require('../utils');

const get = async token => {
    const tokenDetails = await axios.get(`https://api.compound.finance/api/v2/ctoken?addresses[]=${utils.rates[token].address}`);
    return tokenDetails.data.cToken[0];
}

module.exports = {
    get
};