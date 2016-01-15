var mongoose = require('mongoose');
var eventproxy = require('eventproxy');

mongoose.connect('mongodb://localhost/ticflow');

var List = require('../models/List.js');

var lists = [
  { client: { name: 'nameA', address: 'addressA', phone_no: '110', unit: 'unitA'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    value: 10, engineer: 'engineerA'
  },
  { client: { name: 'nameB', address: 'addressB', phone_no: '120', unit: 'unitB'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    value: 20, engineer: 'engineerA'
  },
  { client: { name: 'nameC', address: 'addressC', phone_no: '119', unit: 'unitC'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    value: 30, engineer: 'engineerA'
  },
  { client: { name: 'nameD', address: 'addressD', phone_no: '114', unit: 'unitD'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    value: 40, engineer: 'engineerA'
  },
  { client: { name: 'nameE', address: 'addressE', phone_no: '911', unit: 'unitE'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    value: 50, engineer: 'engineerA'
  },
  { client: { name: 'nameF', address: 'addressF', phone_no: '888', unit: 'unitF'},
    deliver: '', debug: '', visit: '', install: '', warehouse: '', outgoing: '', serial_no: '',
    value: 60, engineer: 'engineerA'
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
