var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var Profit = require('../models/Profit.js');
var AdminFee = require('../models/AdminFee.js');
var ManageFee = require('../models/ManageFee.js');
var CashFlow = require('../models/CashFlow.js');
var SerialNumber = require('../models/SerialNumber.js');
var Factor = require('../models/Factor.js');

var ep = new eventproxy();

Profit.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('profit');
  }
});

AdminFee.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('adminfee');
  }
});

ManageFee.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('managefee');
  }
});

CashFlow.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('cashflow');
  }
});

SerialNumber.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('serialnumber');
  }
});

Factor.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    Factor.create({id: "default", value: 0.83}, function (err, factor) {
      if (err) {
        console.log(err);
      } else {
        console.log(factor);
        ep.emit('factor');
      }
    });
  }
});

ep.all('profit', 'adminfee', 'managefee', 'cashflow', 'serialnumber', 'factor', function () {
  mongoose.connection.close();
});
