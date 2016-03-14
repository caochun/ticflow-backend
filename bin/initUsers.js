var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var User = require('../models/User.js');

// var users = [
//   {id:"余文林", password: "123", role: "saler"},
//   {id:"周坚", password: "123", role:"saler"},
//   {id:"宋菁", password: "123", role:"saler"},
//   {id:"朱鸣", password: "123", role:"saler"},
//   {id:"李倍铭", password: "123", role:"saler"},
//   {id:"沈红扬", password: "123", role:"saler"},
//   {id:"苏井", password: "123", role:"saler"},
//   {id:"许万羽", password: "123", role:"saler"},
//   {id:"钱昊", password: "123", role:"saler"},
//   {id:"陆珺", password: "123", role:"saler"},
//   {id:"陈传玮", password: "123", role:"saler"},
//   {id:"王萍", password: "123", role:"manager"},
//   {id:"周志宇", password: "123", role:"engineer"},
//   {id:"姜国洲", password: "123", role:"engineer"},
//   {id:"彭维锋", password: "123", role:"engineer"},
//   {id:"徐飞", password: "123", role:"engineer"},
//   {id:"施海涛", password: "123", role:"engineer"},
//   {id:"周强", password: "123", role:"admin"}
// ];

// User.remove(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     var ep = new eventproxy();
//     for (var i = 0, length = users.length; i < length; i++) {
//       User.create(users[i], function (err, createdUser) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(createdUser);
//           ep.emit('createUser', createdUser);
//         }
//       });
//     }
//     ep.after('createUser', users.length, function (createdUsers) {
//       mongoose.connection.close();
//     });
//   }
// });

User.create({id: "关婷", password: "123", role: "treasurer"}, function (err, createdUser) {
  if (err) {
    console.log(err);
  } else {
    console.log(createdUser);
    mongoose.connection.close();
  }
});
