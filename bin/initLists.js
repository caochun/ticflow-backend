var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/repairsystem');

var List = require('../models/List.js');

var lists = [
  {clientName: "nameA", clientAddress: "addressA", clientPhoneNumber: "110", clientUnit: "unitA", 
    date: "2015/09/23", machineType: "A", fixType: "A", serviceType: "A", reporter: "reporterA", engineer:"engineerA", completed: false},
  {clientName: "nameB", clientAddress: "addressB", clientPhoneNumber: "120", clientUnit: "unitB", 
    date: "2015/08/23", machineType: "B", fixType: "B", serviceType: "B", reporter: "reporterB", engineer:"engineerB", completed: false},
  {clientName: "nameC", clientAddress: "addressC", clientPhoneNumber: "119", clientUnit: "unitC", 
    date: "2015/07/23", machineType: "C", fixType: "C", serviceType: "C", reporter: "reporterC", engineer:"engineerA", completed: true},
  {clientName: "nameD", clientAddress: "addressD", clientPhoneNumber: "114", clientUnit: "unitD", 
    date: "2015/06/23", machineType: "D", fixType: "D", serviceType: "D", reporter: "reporterD", engineer:"engineerB", completed: true},
  {clientName: "nameE", clientAddress: "addressE", clientPhoneNumber: "911", clientUnit: "unitE", 
    date: "2015/05/23", machineType: "E", fixType: "E", serviceType: "E", reporter: "reporterE", engineer:"undispatched", completed: false},
  {clientName: "nameF", clientAddress: "addressF", clientPhoneNumber: "888", clientUnit: "unitF", 
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
