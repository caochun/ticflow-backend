var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var SalesReport = require ('../../models/SalesReport.js');
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
    return res.redirect('/salesreport?month=' + month);
  }
  SalesReport.find({month: req.query.month}).sort({create_at: -1}).exec(function (err, salesreport) {
    res.render('salesreport', {month: req.query.month, salesreport: salesreport});
  });
});

router.post('/', checkIdSalerassistant, function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "salesreport", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "salesreport", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "salesreport", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "XS" + date + ("00" + number).slice(-3);
    SalesReport.create(req.body, function (err, salesreport) {
      if (err) {
        return res.status(400).send("err in post /salesreport");
      } else {
        return res.status(200).json(salesreport);
      }
    });
  });
});

router.post('/delete/:_id', checkIdSalerassistantOrAdmin, function (req, res, next) {
  if (req.session.user.role === 'salerassistant') {
    SalesReport.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, salesreport) {
      if (err) {
        return res.status(400).send("err in post /salesreport/delete/:_id");
      } else {
        return res.status(200).json(salesreport);
      }
    });
  } else {
    SalesReport.findByIdAndRemove(req.params._id, function (err, salesreport) {
      if (err) {
        return res.status(400).send("err in post /salesreport/delete/:_id");
      } else {
        return res.status(200).json(salesreport);
      }
    });
  }
});

module.exports = router;
