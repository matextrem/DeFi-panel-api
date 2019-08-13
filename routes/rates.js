const express = require('express');
const router = express.Router();
const rateService = require('../services/RateService');

router.get('/all', async (req, res, next) => {
  try {
    const tokenRates = await rateService.getAll();
    res.json({ protocols: tokenRates });
  } catch (e) {
    next(e);
  }
});

router.get('/:token', async (req, res, next) => {
  const protocol = (req.query.protocol).toLowerCase();
  try {
    const tokenRate = await rateService.get(req.params.token, protocol);
    res.json({ protocol, token: req.params.token, rates: tokenRate });
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  const protocol = (req.query.protocol).toLowerCase();
  try {
    const tokenRates = await rateService.getAll(protocol);
    res.json({ protocol, rates: tokenRates });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
