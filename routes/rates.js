const express = require('express');
const router = express.Router();
const rateService = require('../services/RateService');

router.get('/:token', async (req, res, next) => {
  try {
    const response = await rateService.get(req.params.token);
    const tokenRate = {
      borrow_rate: (response.borrow_rate.value * 100).toFixed(2),
      supply_rate: (response.supply_rate.value * 100).toFixed(2),
      exchange_rate: (response.exchange_rate.value * 100).toFixed(2)
    }
    res.json({ token: req.params.token, rates: tokenRate });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
