const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const ratesRouter = require('./routes/rates');


const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/rates', ratesRouter);

// catch 404 and forward to error handler
app.use('*', function (req, res, next) {
  return next(createError(404, 'This url does not exist'));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
