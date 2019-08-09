const express = require('express');
const router = express.Router();
const rateService = require('../services/RateService');

router.get('/:token', async (req, res, next) => {
  const protocol = (req.query.protocol).toLowerCase();
  try {
    const tokenRate = await rateService.get(req.params.token, protocol);
    res.json({ protocol, token: req.params.token, rates: tokenRate });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
