var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var ManageFee = require ('../models/ManageFee.js');
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
    return res.redirect('/managefees?month=' + month);
  }
  ManageFee.find({month: req.query.month}).sort({create_at: -1}).exec(function (err, managefees) {
    res.render('managefees', {month: req.query.month, managefees: managefees});
  });
});

router.post('/', checkIdTreasurer, function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "managefee", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "managefee", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "managefee", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "ZJB" + date + ("00" + number).slice(-3);
    ManageFee.create(req.body, function (err, managefee) {
      if (err) {
        return res.status(400).send("err in post /managefees");
      } else {
        return res.status(200).json(managefee);
      }
    });
  });
});

router.post('/delete/:_id', checkIdTreasurerOrAdmin, function (req, res, next) {
  if (req.session.user.role === 'treasurer') {
    ManageFee.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, managefee) {
      if (err) {
        return res.status(400).send("err in post /managefees/delete/:_id");
      } else {
        return res.status(200).json(managefee);
      }
    });
  } else {
    ManageFee.findByIdAndRemove(req.params._id, function (err, managefee) {
      if (err) {
        return res.status(400).send("err in post /managefees/delete/:_id");
      } else {
        return res.status(200).json(managefee);
      }
    });
  }
});

module.exports = router;
