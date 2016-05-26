var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var BidManagement = require ('../../models/BidManagement.js');
var SerialNumber = require('../../models/SerialNumber.js');

function checkIdSalerassistantOrAdmin(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'salerassistant' && req.session.user.role !== 'admin')) {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

function checkIdSalerassistant(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'salerassistant') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

router.get('/', checkIdSalerassistantOrAdmin, function (req, res, next) {
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/bidmanagement?month=' + month);
  }
  BidManagement.find({month: req.query.month}).sort({create_at: -1}).exec(function (err, bidmanagement) {
    res.render('bidmanagement', {month: req.query.month, bidmanagement: bidmanagement});
  });
});

router.post('/', checkIdSalerassistant, function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "bidmanagement", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "bidmanagement", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "bidmanagement", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "TB" + date + ("00" + number).slice(-3);
    BidManagement.create(req.body, function (err, bidmanagement) {
      if (err) {
        return res.status(400).send("err in post /bidmanagement");
      } else {
        return res.status(200).json(bidmanagement);
      }
    });
  });
});

router.post('/delete/:_id', checkIdSalerassistantOrAdmin, function (req, res, next) {
  if (req.session.user.role === 'salerassistant') {
    BidManagement.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, bidmanagement) {
      if (err) {
        return res.status(400).send("err in post /bidmanagement/delete/:_id");
      } else {
        return res.status(200).json(bidmanagement);
      }
    });
  } else {
    BidManagement.findByIdAndRemove(req.params._id, function (err, bidmanagement) {
      if (err) {
        return res.status(400).send("err in post /bidmanagement/delete/:_id");
      } else {
        return res.status(200).json(bidmanagement);
      }
    });
  }
});

module.exports = router;
