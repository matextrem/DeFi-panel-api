const express = require('express');
const router = express.Router();
const transactionService = require('../services/TransactionService');


router.get('/mint/:token', async (req, res, next) => {
    const protocol = (req.query.protocol).toLowerCase();
    const web3js = req.app.locals.web3js;
    try {
        await transactionService.mint(web3js, req.query.value, req.params.token, protocol);
        res.status(200).json({ status: "ok" });
    } catch (e) {
        next(e);
    }
});

router.get('/borrow/:token', async (req, res, next) => {
    const web3js = req.app.locals.web3js;
    const protocol = (req.query.protocol).toLowerCase();
    try {
        await transactionService.borrow(web3js, req.query.value, req.params.token, protocol);
        res.status(200).json({ status: "ok" });
    } catch (e) {
        next(e);
    }
});

module.exports = router;