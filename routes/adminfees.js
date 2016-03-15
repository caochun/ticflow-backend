var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

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
    return res.redirect('/adminfees?month=' + month);
  }
  var ep = new eventproxy();
  var cell = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  AdminFee.find({month: req.query.month}).exec(function (err, adminfees) {
    adminfees.forEach(function (adminfee) {
      switch (adminfee.detail) {
        case 'rent':
          cell[0] += adminfee.money;
          break;
        case 'property':
          cell[1] += adminfee.money;
          break;
        case 'social':
          cell[2] += adminfee.money;
          break;
        case 'tax':
          cell[3] += adminfee.money;
          break;
        case 'utilities':
          cell[4] += adminfee.money;
          break;
        case 'salary':
          cell[5] += adminfee.money;
          break;
        case 'telebill':
          cell[6] += adminfee.money;
          break;
        case 'carriage':
          cell[7] += adminfee.money;
          break;
        case 'company':
          cell[8] += adminfee.money;
          break;
        case 'birthday':
          cell[9] += adminfee.money;
          break;
        case 'gas':
          cell[10] += adminfee.money;
          break;
        case 'interest':
          cell[11] += adminfee.money;
          break;
        case 'reserved':
          cell[12] += adminfee.money;
          break;
        case 'others':
          cell[14] += adminfee.money;
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
    res.render('adminfees', {month: req.query.month, cell: cell});
  });
});

router.get('/detail', function (req, res, next) {
  AdminFee.find(req.query).sort({create_at: -1}).exec(function (err, adminfees) {
    if (err) {
      return res.status(400).send("err in get /adminfees/detail");
    } else {
      return res.status(200).json(adminfees);
    }
  });
});

router.post('/', function (req, res, next) {
  AdminFee.create(req.body, function (err, adminfee) {
    if (err) {
      return res.status(400).send("err in post /adminfee");
    } else {
      return res.status(200).json(adminfee);
    }
  });
});

router.post('/delete/:_id', function (req, res, next) {
  AdminFee.findByIdAndRemove(req.params._id, function (err, adminfee) {
    if (err) {
      return res.status(400).send("err in post /adminfees/delete/:_id");
    } else {
      return res.status(200).json(adminfee);
    }
  });
});

module.exports = router;
