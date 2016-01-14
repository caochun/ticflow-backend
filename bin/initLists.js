var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var List = require('../models/List.js');

var lists = [
  {client: {name: "nameA", address: "addressA", phone_no: "110", unit: "unitA"},
    date: "2015/09/23", machineType: "A", fixType: "A", serviceType: "A", reporter: "reporterA", engineer:"engineerA", completed: false},
  {client: {name: "nameB", address: "addressB", phone_no: "120", unit: "unitB"},
    date: "2015/08/23", machineType: "B", fixType: "B", serviceType: "B", reporter: "reporterB", engineer:"engineerB", completed: false},
  {client: {name: "nameC", address: "addressC", phone_no: "119", unit: "unitC"},
    date: "2015/07/23", machineType: "C", fixType: "C", serviceType: "C", reporter: "reporterC", engineer:"engineerA", completed: true},
  {client: {name: "nameD", address: "addressD", phone_no: "114", unit: "unitD"},
    date: "2015/06/23", machineType: "D", fixType: "D", serviceType: "D", reporter: "reporterD", engineer:"engineerB", completed: true},
  {client: {name: "nameE", address: "addressE", phone_no: "911", unit: "unitE"},
    date: "2015/05/23", machineType: "E", fixType: "E", serviceType: "E", reporter: "reporterE", engineer:"undispatched", completed: false},
  {client: {name: "nameF", address: "addressF", phone_no: "888", unit: "unitF"},
    date: "2015/04/23", machineType: "F", fixType: "F", serviceType: "F", reporter: "reporterF", engineer:"undispatched", completed: false},
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
          ep.emit('createList', createdList);
        }
      });
    }
    ep.after('createList', lists.length, function (createdLists) {
      console.log(createdLists);
      mongoose.connection.close();
    });
  }
});
