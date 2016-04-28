var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var CashFlow = require ('../models/CashFlow.js');
var SerialNumber = require('../models/SerialNumber.js');

function checkIdTreasurerOrAdmin(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'treasurer' && req.session.user.role !== 'admin')) {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

function checkIdTreasurer(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'treasurer') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

router.get('/', checkIdTreasurerOrAdmin, function (req, res, next) {
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/cashflow?month=' + month);
  }
  CashFlow.find({month: req.query.month}).sort({create_at: -1}).exec(function (err, cashflow) {
    res.render('cashflow', {month: req.query.month, cashflow: cashflow});
  });
});

router.post('/', checkIdTreasurer, function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "cashflow", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "cashflow", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "cashflow", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "XJ" + date + ("00" + number).slice(-3);
    CashFlow.create(req.body, function (err, cashflow) {
      if (err) {
        return res.status(400).send("err in post /cashflow");
      } else {
        return res.status(200).json(cashflow);
      }
    });
  });
});

router.post('/delete/:_id', checkIdTreasurerOrAdmin, function (req, res, next) {
  if (req.session.user.role === 'treasurer') {
    CashFlow.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, cashflow) {
      if (err) {
        return res.status(400).send("err in post /cashflow/delete/:_id");
      } else {
        return res.status(200).json(cashflow);
      }
    });
  } else {
    CashFlow.findByIdAndRemove(req.params._id, function (err, cashflow) {
      if (err) {
        return res.status(400).send("err in post /cashflow/delete/:_id");
      } else {
        return res.status(200).json(cashflow);
      }
    });
  }
});

module.exports = router;
