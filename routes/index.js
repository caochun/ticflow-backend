var express = require('express');
var router = express.Router();
var ejs = require('ejs');

var User = require('../models/User.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('login', {message: ""});
});

router.post('/login', function (req, res, next) {
  User.findOne(req.body, function (err, user) {
    if (user === null) {
      //req.flash('error', "用户名或密码错误！");
      return res.redirect('/login');
    } else if (user.role !== 'manager') {
      //req.flash('error', "非派单员不能登录！");
      return res.redirect('/login');
    } else {
      return res.redirect('/homepage');
    }
  });
});

router.get('/homepage', function (req, res, next) {
  res.render('homepage');
});

module.exports = router;
