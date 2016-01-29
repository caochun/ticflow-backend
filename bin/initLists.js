var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var List = require('../models/List.js');

var lists = [
];

List.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    var ep = new eventproxy();
    for (var i = 0, length = lists.length; i < length; i++) {
      List.create(lists[i], function (err, createdList) {
        if (err) {
          console.log(err);
        } else {
          console.log(createdList);
          ep.emit('createList', createdList);
        }
      });
    }
    ep.after('createList', lists.length, function (createdLists) {
      mongoose.connection.close();
    });
  }
});
