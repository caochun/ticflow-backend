var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../../models/User.js');
var Prestore = require('../../models/Prestore.js');
var SerialNumber = require('../../models/SerialNumber.js');

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
  var ep = new eventproxy();

  var salers = [];
  User.find({role: 'saler'}).sort({id: -1}).exec(function (err, users) {
    users.forEach(function (entry) {
      if (salers.indexOf(entry.id) == -1)
        salers.push(entry.id);
    });
    ep.emit('saler');
  });

  ep.on('saler', function () {
    if (!req.query.saler)
      res.render('prestore', {salers: salers, saler: "全部"});
    else
      res.render('prestore', {salers: salers, saler: req.query.saler});
  });
});

router.get('/detail', checkIdTreasurerOrAdmin, function (req, res, next) {
  Prestore.find(req.query).sort({create_at: -1}).exec(function (err, prestore) {
    if (err) {
      return res.status(400).send("err in get /prestore/detail");
    } else {
      return res.status(200).json(prestore);
    }
  });
});

router.post('/', checkIdTreasurer, function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "prestore", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "prestore", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "prestore", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "YC" + date + ("00" + number).slice(-3);
    Prestore.create(req.body, function (err, prestore) {
      if (err) {
        return res.status(400).send("err in post /prestore");
      } else {
        return res.status(200).json(prestore);
      }
    });
  });
});

router.post('/delete/:_id', checkIdTreasurerOrAdmin, function (req, res, next) {
  if (req.session.user.role === 'treasurer') {
    Prestore.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, prestore) {
      if (err) {
        return res.status(400).send("err in post /prestore/delete/:_id");
      } else {
        return res.status(200).json(prestore);
      }
    });
  } else {
    Prestore.findByIdAndRemove(req.params._id, function (err, prestore) {
      if (err) {
        return res.status(400).send("err in post /prestore/delete/:_id");
      } else {
        return res.status(200).json(prestore);
      }
    });
  }
});

module.exports = router;
