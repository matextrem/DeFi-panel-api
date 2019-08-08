var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const web3 = require('web3');


var ratesRouter = require('./routes/rates');
var transactionsRouter = require('./routes/transactions');


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Infura HttpProvider Endpoint
app.locals.web3js = new web3(new web3.providers.HttpProvider(`https://${process.env.SELECTED_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`));

app.use('/rates', ratesRouter);
app.use('/transactions', transactionsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('error');
  // res.render('error');
});

module.exports = app;
