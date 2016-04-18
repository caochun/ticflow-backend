var express = require('express');
var router = express.Router();
var ejs = require('ejs');

var User = require('../models/User.js');

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
    } else if (user.frozen) {
      req.flash('error', "用户已被冻结！");
      return res.redirect('/login');
    } else if (user.role === 'manager') {
      req.session.user = user;
      return res.redirect('/manager');
    } else if (user.role === 'treasurer') {
      req.session.user = user;
      return res.redirect('/treasurer');
    } else if (user.role === 'admin') {
      req.session.user = user;
      return res.redirect('/profits');
    } else {
      req.flash('error', "仅派单员、管理员、财务可登陆");
      return res.redirect('/login');
    }
  });
});

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  return res.redirect('/login');
});

module.exports = router;
