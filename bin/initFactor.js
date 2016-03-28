var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var Factor = require('../models/Factor.js');

Factor.remove(function (err) {
  if (err) {
    console.log(err);
  } else {
    Factor.create({id: "default", value: 0.83}, function (err, factor) {
      if (err) {
        console.log(err);
      } else {
        console.log(factor);
        mongoose.connection.close();
      }
    });
  }
});


