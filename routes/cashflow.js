var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var CashFlow = require ('../models/CashFlow.js');

router.get('/', function (req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'treasurer' && req.session.user.role !== 'admin')) {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/cashflow?month=' + month);
  }
  CashFlow.find({month: req.query.month}).sort({create_at: -1}).exec(function (err, cashflow) {
    res.render('cashflow', {month: req.query.month, cashflow: cashflow});
  });
});

router.post('/', function (req, res, next) {
  CashFlow.create(req.body, function (err, cashflow) {
    if (err) {
      return res.status(400).send("err in post /cashflow");
    } else {
      return res.status(200).json(cashflow);
    }
  });
});

router.post('/delete/:_id', function (req, res, next) {
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
