var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var AdminFee = require('../models/AdminFee.js');
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
    return res.redirect('/adminfees?month=' + month);
  }
  var ep = new eventproxy();
  var cell = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var flag = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  AdminFee.find({month: req.query.month}).exec(function (err, adminfees) {
    adminfees.forEach(function (adminfee) {
      switch (adminfee.detail) {
        case 'rent':
          cell[0] += adminfee.money;
          flag[0] = flag[0] || adminfee.dlt;
          break;
        case 'property':
          cell[1] += adminfee.money;
          flag[1] = flag[1] || adminfee.dlt;
          break;
        case 'social':
          cell[2] += adminfee.money;
          flag[2] = flag[2] || adminfee.dlt;
          break;
        case 'tax':
          cell[3] += adminfee.money;
          flag[3] = flag[3] || adminfee.dlt;
          break;
        case 'utilities':
          cell[4] += adminfee.money;
          flag[4] = flag[4] || adminfee.dlt;
          break;
        case 'salary':
          cell[5] += adminfee.money;
          flag[5] = flag[5] || adminfee.dlt;
          break;
        case 'telebill':
          cell[6] += adminfee.money;
          flag[6] = flag[6] || adminfee.dlt;
          break;
        case 'carriage':
          cell[7] += adminfee.money;
          flag[7] = flag[7] || adminfee.dlt;
          break;
        case 'company':
          cell[8] += adminfee.money;
          flag[8] = flag[8] || adminfee.dlt;
          break;
        case 'birthday':
          cell[9] += adminfee.money;
          flag[9] = flag[9] || adminfee.dlt;
          break;
        case 'gas':
          cell[10] += adminfee.money;
          flag[10] = flag[10] || adminfee.dlt;
          break;
        case 'interest':
          cell[11] += adminfee.money;
          flag[11] = flag[11] || adminfee.dlt;
          break;
        case 'reserved':
          cell[12] += adminfee.money;
          flag[12] = flag[12] || adminfee.dlt;
          break;
        case 'others':
          cell[14] += adminfee.money;
          flag[14] = flag[14] || adminfee.dlt;
          break;
      }
    });
    ep.emit('adminfee');
  });

  ManageFee.find({month: req.query.month}).exec(function (err, managefees) {
    managefees.forEach(function (managefee) {
      cell[13] += managefee.money;
    });
    ep.emit('managefee');
  });

  ep.all('adminfee', 'managefee', function () {
    cell.push(cell[0] + cell[1] + cell[2] + cell[3] + cell[4] + cell[5] + cell[6] + cell[7] +
      cell[8] + cell[9] + cell[10] + cell[11] + cell[12] + cell[13] + cell[14]);
    for (var i = 0; i < 15; i++) {
      flag[i] = flag[i] && (req.session.user.role === 'admin');
    }
    res.render('adminfees', {month: req.query.month, cell: cell, flag: flag});
  });
});

router.get('/detail', checkIdTreasurerOrAdmin, function (req, res, next) {
  AdminFee.find(req.query).sort({create_at: -1}).exec(function (err, adminfees) {
    if (err) {
      return res.status(400).send("err in get /adminfees/detail");
    } else {
      return res.status(200).json(adminfees);
    }
  });
});

router.post('/', checkIdTreasurer, function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "adminfee", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "adminfee", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "adminfee", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "XZ" + date + ("00" + number).slice(-3);
    AdminFee.create(req.body, function (err, adminfee) {
      if (err) {
        return res.status(400).send("err in post /adminfees");
      } else {
        return res.status(200).json(adminfee);
      }
    });
  });
});

router.post('/delete/:_id', checkIdTreasurerOrAdmin, function (req, res, next) {
  if (req.session.user.role === 'treasurer') {
    AdminFee.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, adminfee) {
      if (err) {
        return res.status(400).send("err in post /adminfees/delete/:_id");
      } else {
        return res.status(200).json(adminfee);
      }
    });
  } else {
    AdminFee.findByIdAndRemove(req.params._id, function (err, adminfee) {
      if (err) {
        return res.status(400).send("err in post /adminfees/delete/:_id");
      } else {
        return res.status(200).json(adminfee);
      }
    });
  }
});

module.exports = router;
