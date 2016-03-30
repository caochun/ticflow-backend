var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var List = require('../models/List.js');
var SerialNumber = require('../models/SerialNumber.js');

router.get('/', function (req, res, next) {
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

router.post('/', function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "list", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "list", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "list", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = date + ("00" + number).slice(-3);
    List.create(req.body, function (err, list) {
      req.flash('success', "创建成功！");
      return res.redirect('/manager');
    });
  });
});

module.exports = router;
