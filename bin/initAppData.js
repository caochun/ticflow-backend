var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var List = require('../models/List.js');
var ValueChange = require('../models/ValueChange.js');

var ep = new eventproxy();

List.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('list');
  }
});

ValueChange.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    ep.emit('valuechange');
  }
});

ep.all('list', 'valuechange', function () {
  mongoose.connection.close();
});
