var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var List = require('../models/List.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  User.findOne(req.body, function (err, user) {
    if (user === null) {
      req.flash('error', "用户名或密码错误！");
      return res.redirect('/login');
    } else if (user.role === 'manager') {
      req.session.user = user;
      return res.redirect('/manager');
    } else if (user.role === 'treasurer') {
      req.session.user = user;
      return res.redirect('/treasurer');
    } else {
      req.flash('error', "非派单员或财务员不能登录！");
      return res.redirect('/login');
    }
  });
});

router.get('/manager', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'manager') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }

  var ep = new eventproxy();

  var units = [];
  var names = [];
  var addresses = [];
  var phone_nos = [];
  var salers = [];
  var engineers = [];
  List.find().sort({date: -1}).select('client').exec(function (err, lists) {
    lists.forEach(function (entry) {
      if (units.indexOf(entry.client.unit) == -1)
        units.push(entry.client.unit);
      if (names.indexOf(entry.client.name) == -1)
        names.push(entry.client.name);
      if (addresses.indexOf(entry.client.address) == -1)
        addresses.push(entry.client.address);
      if (phone_nos.indexOf(entry.client.phone_no) == -1)
        phone_nos.push(entry.client.phone_no);
    });
    ep.emit('client');
  });

  User.find({role: 'saler'}).sort({id: -1}).exec(function (err, users) {
    users.forEach(function (entry) {
      if (salers.indexOf(entry.id) == -1)
        salers.push(entry.id);
    });
    ep.emit('saler');
  });

  User.find({role: 'engineer'}).sort({id: -1}).exec(function (err, users) {
    users.forEach(function (entry) {
      if (engineers.indexOf(entry.id) == -1)
        engineers.push(entry.id);
    });
    ep.emit('engineer');
  });

  ep.all('client', 'saler', 'engineer', function () {
      res.render('manager', {units: units, names: names, addresses: addresses, phone_nos: phone_nos,
        salers: salers, engineers: engineers});
  });
});

router.post('/manager', function (req, res, next) {
  List.create(req.body, function (err, list) {
    req.flash('success', "创建成功！");
    return res.redirect('/manager');
  });
});

router.get('/treasurer', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'treasurer') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  res.render('treasurer');
});

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  return res.redirect('/login');
});

module.exports = router;
