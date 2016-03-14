var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var Profit = require('../models/Profit.js');

router.get('/', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'treasurer') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/profits?month=' + month + '&factor=0.85');
  }
  var ep = new eventproxy();
  var salers = [];
  User.find({role: 'saler'}).sort({id: -1}).exec(function (err, users) {
    users.forEach(function (entry) {
        salers.push(entry.id);
    });
    ep.emit('salers');
  });
  var cells = [];
  ep.on('salers', function () {
    for (var i = 0; i < salers.length; i++) {
      ep.on('saler' + i, (function (i) {
        return function () {
          Profit.find({month: req.query.month, saler: salers[i]}).exec(function (err, profits) {
            var cell = [0, 0, 0, 0, 0, 0];
            profits.forEach(function (profit) {
              switch (profit.detail) {
                case 'profit':
                  cell[0] += profit.money;
                  break;
                case 'travel':
                  cell[1] += profit.money;
                  break;
                case 'entertainment':
                  cell[2] += profit.money;
                  break;
                case 'bidding':
                  cell[3] += profit.money;
                  break;
                case 'brokerage':
                  cell[4] += profit.money;
                  break;
                case 'others':
                  cell[5] += profit.money;
                  break;
              }
            });
            cell.push(cell[0] - cell[1] - cell[2] - cell[3] - cell[4] - cell[5]);
            cell.push(cell[6] * req.query.factor);
            cells.push(cell);
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
      res.render('profits', {salers: salers, cells: cells, total: total, month: req.query.month, factor: req.query.factor});
    });
  });
});

router.post('/', function (req, res, next) {
  Profit.create(req.body, function (err, profit) {
    if (err) {
      return res.status(400).send("err in post /profit");
    } else {
      return res.status(200).json(profit);
    }
  });
});

module.exports = router;
