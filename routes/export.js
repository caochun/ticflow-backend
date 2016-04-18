var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

router.get('/', function (req, res, next) {
  if (!req.session.user || req.session.user.role !== 'manager') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }

  if (!req.query.month) {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    return res.redirect('/export?month=' + month);
  }

  res.render('export', {month: req.query.month});
});

module.exports = router;
