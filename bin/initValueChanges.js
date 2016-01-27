var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var ValueChange = require('../models/Valuechange.js');

ValueChange.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    mongoose.connection.close();
  }
});


