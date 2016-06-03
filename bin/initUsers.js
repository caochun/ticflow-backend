var mongoose = require('mongoose');
var eventproxy = require('eventproxy');
var uuid = require("node-uuid");

mongoose.connect('mongodb://localhost/ticflow');

var User = require('../models/User.js');

var users = [
  {id: "关婷", password: "gt001002", role: "treasurer"},
  {id: "陈传玮", password: "123", role: "saler"},
  {id: "陆珺", password: "821208", role: "saler"},
  {id: "钱昊", password: "123", role: "saler"},
  {id: "许万羽", password: "jsx123xwy", role: "saler"},
  {id: "苏井", password: "123456", role: "saler"},
  {id: "沈红扬", password: "198778", role: "saler"},
  {id: "李倍铭", password: "123321", role: "saler"},
  {id: "朱鸣", password: "10010", role: "saler"},
  {id: "宋菁", password: "1234", role: "saler"},
  {id: "周坚", password: "121513", role: "saler"},
  {id: "余文林", password: "400388", role: "saler", frozen:true},
  {id: "王萍", password: "wp12345", role: "manager"},
  {id: "施海涛", password: "313720", role: "engineer"},
  {id: "徐飞", password: "456", role: "engineer"},
  {id: "彭维锋", password: "123", role: "engineer"},
  {id: "姜国洲", password: "123", role: "engineer"},
  {id: "周志宇", password: "007300", role: "engineer"},
  {id: "周强", password: "zhouqiang001002", role: "admin"},
  {id: "汪敏", password: "123", role: "salerassistant"},
];

User.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    var ep = new eventproxy();
    for (var i = 0, length = users.length; i < length; i++) {
      users[i].token = uuid.v4();
      User.create(users[i], function (err, createdUser) {
        if (err) {
          console.log(err);
        } else {
          console.log(JSON.stringify(createdUser));
          ep.emit('createUser', createdUser);
        }
      });
    }
    ep.after('createUser', users.length, function (createdUsers) {
      mongoose.connection.close();
    });
  }
});
