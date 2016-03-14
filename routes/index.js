var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../models/User.js');
var List = require('../models/List.js');
var Profit = require('../models/Profit.js');
var AdminFee = require('../models/AdminFee.js');
var ManageFee = require ('../models/ManageFee.js');

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
  var ep = new eventproxy();
  var salers = [];
  User.find({role: 'saler'}).sort({id: -1}).exec(function (err, users) {
    users.forEach(function (entry) {
      if (salers.indexOf(entry.id) == -1)
        salers.push(entry.id);
    });
    ep.emit('saler');
  });
  ep.all('saler', function () {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    res.render('treasurer', {salers: salers, month: month});
  });
});

router.get('/profits', function (req, res, next) {
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

router.post('/profit', function (req, res, next) {
  Profit.create(req.body, function (err, profit) {
    if (err) {
      return res.status(400).send("err in post /profit");
    } else {
      return res.status(200).json(profit);
    }
  });
});

router.get('/adminfees', function (req, res, next) {
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
  ep.on('adminfee', function () {
    ManageFee.find({month: req.query.month}).exec(function (err, managefees) {
      managefees.forEach(function (managefee) {
        cell[13] += managefee.money;
      });
      ep.emit('managefee');
    });
  });
  ep.on('managefee', function () {
    cell.push(cell[0] + cell[1] + cell[2] + cell[3] + cell[4] + cell[5] + cell[6] + cell[7] +
      cell[8] + cell[9] + cell[10] + cell[11] + cell[12] + cell[13] + cell[14]);
    res.render('adminfees', {month: req.query.month, cell: cell});
  });
});

router.post('/adminfee', function (req, res, next) {
  AdminFee.create(req.body, function (err, adminfee) {
    if (err) {
      return res.status(400).send("err in post /adminfee");
    } else {
      return res.status(200).json(adminfee);
    }
  });
});

router.get('/managefees', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'treasurer') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/managefees?month=' + month);
  }
  ManageFee.find({month: req.query.month}).sort({create_at: -1}).exec(function (err, managefees) {
    res.render('managefees', {month: req.query.month, managefees: managefees});
  });
});

router.post('/managefee', function (req, res, next) {
  ManageFee.create(req.body, function (err, managefee) {
    if (err) {
      return res.status(400).send("err in post /managefee");
    } else {
      return res.status(200).json(managefee);
    }
  });
});

router.get('/total', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'treasurer') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/total?month=' + month + '&factor=0.85');
  }
  res.render('total', {month: req.query.month, factor: req.query.factor});
});

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  return res.redirect('/login');
});

module.exports = router;
