var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var Profit = require('../models/Profit.js');
var Factor = require('../models/Factor.js');
var SerialNumber = require('../models/SerialNumber.js');

router.get('/', function (req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'treasurer' && req.session.user.role !== 'admin')) {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  if (!req.query.month && !req.query.factor) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    Factor.findOne({id: "default"}, function (err, factor) {
      return res.redirect('/profits?month=' + month + '&factor=' + factor.value);
    });
  }
  var ep = new eventproxy();
  Factor.findOneAndUpdate({id: "default"}, {value: req.query.factor}, function (err, factor) {
    ep.emit('factor');
  });
  var salers = [];
  ep.on('factor', function () {
    User.find({role: 'saler'}).sort({id: -1}).exec(function (err, users) {
      users.forEach(function (entry) {
          salers.push(entry.id);
      });
      ep.emit('salers');
    });
  });
  var cells = [];
  var flags = [];
  ep.on('salers', function () {
    for (var i = 0; i < salers.length; i++) {
      ep.on('saler' + i, (function (i) {
        return function () {
          Profit.find({month: req.query.month, saler: salers[i]}).exec(function (err, profits) {
            var cell = [0, 0, 0, 0, 0, 0];
            var flag = [false, false, false, false, false, false];
            profits.forEach(function (profit) {
              switch (profit.detail) {
                case 'profit':
                  cell[0] += profit.money;
                  flag[0] = flag[0] || profit.dlt;
                  break;
                case 'travel':
                  cell[1] += profit.money;
                  flag[1] = flag[1] || profit.dlt;
                  break;
                case 'entertainment':
                  cell[2] += profit.money;
                  flag[2] = flag[2] || profit.dlt;
                  break;
                case 'bidding':
                  cell[3] += profit.money;
                  flag[3] = flag[3] || profit.dlt;
                  break;
                case 'brokerage':
                  cell[4] += profit.money;
                  flag[4] = flag[4] || profit.dlt;
                  break;
                case 'others':
                  cell[5] += profit.money;
                  flag[5] = flag[5] || profit.dlt;
                  break;
              }
            });
            cell.push(cell[0] - cell[1] - cell[2] - cell[3] - cell[4] - cell[5]);
            cell.push(cell[6] * req.query.factor);
            cells.push(cell);
            for (var j = 0; j < 6; j ++) {
              flag[j] = flag[j] && (req.session.user.role === 'admin');
            }
            flags.push(flag);
            ep.emit('saler' + (i + 1));
            ep.emit('cell');
          });
        };
      })(i));
    }
    ep.emit('saler' + 0);

    ep.after('cell', salers.length, function () {
      var total = [0, 0, 0, 0, 0, 0, 0, 0];
      cells.forEach (function (cell) {
        total[0] += cell[0];
        total[1] += cell[1];
        total[2] += cell[2];
        total[3] += cell[3];
        total[4] += cell[4];
        total[5] += cell[5];
        total[6] += cell[6];
        total[7] += cell[7];
      });
      res.render('profits', {salers: salers, cells: cells, flags: flags, total: total, month: req.query.month, factor: req.query.factor});
    });
  });
});

router.get('/detail', function (req, res, next) {
  Profit.find(req.query).sort({create_at: -1}).exec(function (err, profits) {
    if (err) {
      return res.status(400).send("err in get /profits/detail");
    } else {
      return res.status(200).json(profits);
    }
  });
});

router.post('/', function (req, res, next) {
  var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "profit", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "profit", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "profit", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = "XS" + date + ("00" + number).slice(-3);
    Profit.create(req.body, function (err, profit) {
      if (err) {
        return res.status(400).send("err in post /profits");
      } else {
        return res.status(200).json(profit);
      }
    });
  });
});

router.post('/delete/:_id', function (req, res, next) {
  if (req.session.user.role === 'treasurer') {
    Profit.findByIdAndUpdate(req.params._id, {dlt: true}, function (err, profit) {
      if (err) {
        return res.status(400).send("err in post /profits/delete/:_id");
      } else {
        return res.status(200).json(profit);
      }
    });
  } else {
    Profit.findByIdAndRemove(req.params._id, function (err, profit) {
      if (err) {
        return res.status(400).send("err in post /profits/delete/:_id");
      } else {
        return res.status(200).json(profit);
      }
    });
  }
});

module.exports = router;
