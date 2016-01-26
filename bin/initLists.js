var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var List = require('../models/List.js');

var lists = [
  { client: { name: 'nameA', address: 'addressA', phone_no: '100', unit: 'unitA'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA',
  },
  { client: { name: 'nameB', address: 'addressB', phone_no: '101', unit: 'unitB'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA',
  },
  { client: { name: 'nameC', address: 'addressC', phone_no: '102', unit: 'unitC'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA', accepted: true, acceptTime: new Date(), serveTime: new Date(),
  },
  { client: { name: 'nameD', address: 'addressD', phone_no: '103', unit: 'unitD'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA', accepted: true, acceptTime: new Date(), serveTime: new Date(),
  },
  { client: { name: 'nameE', address: 'addressE', phone_no: '104', unit: 'unitE'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA', accepted: true, acceptTime: new Date(), serveTime: new Date(),
    completed: true, completeTime: new Date(), feedback:'OK',
  },
  { client: { name: 'nameF', address: 'addressF', phone_no: '105', unit: 'unitF'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA', accepted: true, acceptTime: new Date(), serveTime: new Date(),
    completed: true, completeTime: new Date(), feedback:'OK',
  },
  { client: { name: 'nameG', address: 'addressG', phone_no: '106', unit: 'unitG'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA', accepted: true, acceptTime: new Date(), serveTime: new Date(),
    completed: true, completeTime: new Date(), feedback:'OK', checked: true, checkTime: new Date(), checkMonth: "2016/01"
  },
  { client: { name: 'nameH', address: 'addressH', phone_no: '107', unit: 'unitH'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    saler: 'salerA', value: 10, engineer: 'engineerA', accepted: true, acceptTime: new Date(), serveTime: new Date(),
    completed: true, completeTime: new Date(), feedback:'OK', checked: true, checkTime: new Date(), checkMonth: "2016/01"
  },
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
