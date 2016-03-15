var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var ManageFee = require ('../models/ManageFee.js');

router.get('/', function (req, res, next) {
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

router.post('/', function (req, res, next) {
  ManageFee.create(req.body, function (err, managefee) {
    if (err) {
      return res.status(400).send("err in post /managefee");
    } else {
      return res.status(200).json(managefee);
    }
  });
});

router.post('/delete/:_id', function (req, res, next) {
  ManageFee.findByIdAndRemove(req.params._id, function (err, managefee) {
    if (err) {
      return res.status(400).send("err in post /managefees/delete/:_id");
    } else {
      return res.status(200).json(managefee);
    }
  });
});

module.exports = router;
