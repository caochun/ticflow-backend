var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var Prestore = require ('../models/Prestore.js');
var SerialNumber = require('../models/SerialNumber.js');

router.get('/', function (req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'treasurer' && req.session.user.role !== 'admin')) {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  Prestore.find().sort({create_at: -1}).exec(function (err, prestore) {
    var data = [];
    prestore.forEach(function (entry) {
      var i;
      for (i = 0; i < data.length; i++) {
        if (data[i].saler == entry.saler && data[i].client == entry.client && data[i].contacter == entry.contacter) {
          if (entry.detail == "income") data[i].account += entry.money;
          else data[i].account -= entry.money;
          break;
        }
      }
      if (i == data.length) {
        var account = (entry.detail == "income") ? entry.money : (- entry.money);
        data[i] = {saler: entry.saler, client: entry.client, contacter: entry.contacter, account: account};
      }
    });
    res.render('prestore', {data: data});
  });
});

router.get('/detail', function (req, res, next) {
  Prestore.find(req.query).sort({create_at: -1}).exec(function (err, prestore) {
    if (err) {
      return res.status(400).send("err in get /prestore/detail");
    } else {
      return res.status(200).json(prestore);
    }
  });
});

router.post('/', function (req, res, next) {
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

router.post('/delete/:_id', function (req, res, next) {
  Prestore.findByIdAndRemove(req.params._id, function (err, prestore) {
    if (err) {
      return res.status(400).send("err in post /prestore/delete/:_id");
    } else {
      return res.status(200).json(prestore);
    }
  });
});

module.exports = router;
