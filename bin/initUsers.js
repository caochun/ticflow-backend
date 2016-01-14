var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/repairsystem');

var User = require('../models/User.js');

var users = [
  {id: "saler", password: "123", role: "saler"},
  {id: "engineerA", password: "123", role: "engineer"},
  {id: "engineerB", password: "123", role: "engineer"},
  {id: "manager", password: "123", role: "manager"},
  {id: "admin", password: "123", role: "admin"}
];

User.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    var ep = new eventproxy();
    for (var i = 0, length = users.length; i < length; i++) {
      User.create(users[i], function (err, createdUser) {
        if (err) {
          console.log(err);
        } else {
          ep.emit('createUser', createdUser);
        }
      });
    }
    ep.after('createUser', users.length, function (createdUsers) {
      console.log(createdUsers);
      mongoose.connection.close();
    });
  }
});


