var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var List = require('../../models/List.js');

function checkIdManager(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'manager') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

router.get('/', checkIdManager, function (req, res, next) {
  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/export?month=' + month);
  }
  res.render('export', {month: req.query.month});
});

router.get('/lists', function (req, res) {
  List.find({checkMonth: req.query.month}).sort({checkTime: 1}).exec(function (err, lists) {
    return res.status(200).json(lists);
  });
});

module.exports = router;
