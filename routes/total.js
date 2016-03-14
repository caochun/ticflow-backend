var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var List = require('../models/List.js');
var Profit = require('../models/Profit.js');
var AdminFee = require('../models/AdminFee.js');
var ManageFee = require ('../models/ManageFee.js');

router.get('/', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'treasurer') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/total?month=' + month + '&factor=0.85');
  }

  var ep = new eventproxy();
  var gross = 0, expend = 0;

  Profit.find({month: req.query.month}).exec(function (err, profits) {
    profits.forEach(function (profit) {
      if (profit.detail == 'profit')
        gross += profit.money;
      else
        gross -= profit.money;
    });
    ep.emit('gross');
  });

  AdminFee.find({month: req.query.month}).exec(function (err, adminfees) {
    adminfees.forEach(function (adminfee) {
      expend += adminfee.money;
    });
    ep.emit('adminfee');
  });
  
  ManageFee.find({month: req.query.month}).exec(function (err, managefees) {
    managefees.forEach(function (managefee) {
      expend += managefee.money;
    });
    ep.emit('managefee');
  });

  ep.all('gross', 'adminfee', 'managefee', function () {
    res.render('total', {month: req.query.month, factor: req.query.factor, gross: gross, expend: expend});
  });
});

module.exports = router;
