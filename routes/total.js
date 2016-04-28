var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var List = require('../models/List.js');
var Profit = require('../models/Profit.js');
var Factor = require('../models/Factor.js');
var AdminFee = require('../models/AdminFee.js');
var ManageFee = require ('../models/ManageFee.js');

function checkIdTreasurerOrAdmin(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'treasurer' && req.session.user.role !== 'admin')) {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

router.get('/', checkIdTreasurerOrAdmin, function (req, res, next) {
  if (!req.query.month && !req.query.factor) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    Factor.findOne({id: "default"}, function (err, factor) {
      return res.redirect('/total?month=' + month + '&factor=' + factor.value);
    });
  }

  var ep = new eventproxy();
  Factor.findOneAndUpdate({id: "default"}, {value: req.query.factor}, function (err, factor) {
    ep.emit('factor');
  });

  var gross = 0, expend = 0;
  ep.on('factor', function () {
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
  });

  ep.all('gross', 'adminfee', 'managefee', function () {
    res.render('total', {month: req.query.month, factor: req.query.factor, gross: gross, expend: expend});
  });
});

module.exports = router;
