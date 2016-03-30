var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var List = require('../models/List.js');
var SerialNumber = require('../models/SerialNumber.js');

router.post('/', function (req, res) {
	var now = new Date();
  var date = now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2);

  var number = 0;
  var ep = new eventproxy();

  SerialNumber.findOne({id: "list", date: date}, function (err, serialnumber) {
    if (!serialnumber) {
      number = 1;
      SerialNumber.create({id: "list", date: date, value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    } else {
      number = serialnumber.value + 1;
      SerialNumber.findOneAndUpdate({id: "list", date: date}, {value: number}, function (err, serialnumber) {
        ep.emit('number');
      });
    }
  });

  ep.on('number', function () {
    req.body.serial_number = date + ("00" + number).slice(-3);
    List.create(req.body, function (err, list) {
      if (err) {
        return res.status(400).send("err in post /lists");
      } else {
        return res.status(200).json(list);
      }
    });
  });
});

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : req.query.limit;

	delete req.query.page;
	delete req.query.limit;

  var clientname = req.query['client.name'];

	if (!clientname) {
		List.find(req.query).select('serial_number client saler engineer date acceptTime completeTime checkTime').skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, lists) {
			if (err) {
				return res.status(400).send("err in get /lists");
			} else {
				return res.status(200).json(lists);
			}
		});
	} else {
		var regexp = new RegExp("^" + clientname);
		req.query['client.name'] = regexp;

		List.find(req.query).select('serial_number client saler engineer date').skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, lists) {
			if (err) {
				return res.status(400).send("err in get /lists");
			} else {
				return res.status(200).json(lists);
			}
		});
	}
});

router.get('/checked', function (req, res) {
	var now = new Date();
  var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
  
	List.find({checkMonth: month}).sort({checkTime: 1}).exec(function (err, lists) {
		if (err) {
				return res.status(400).send("err in get /lists/checked");
			} else {
				return res.status(200).json(lists);
			}
	});
});

router.post('/remove/:_id', function (req, res) {
	List.findByIdAndRemove(req.params._id, function (err, list) {
		if (err) {
			return res.status(400).send("err in post /lists/remove/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.post('/:_id', function (req, res) {
	List.findByIdAndUpdate(req.params._id, req.body, function (err, list) {
		if (err) {
			return res.status(400).send("err in put /lists/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.get('/totalvalue', function (req, res) {
	List.find(req.query, function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists/totalValue");
		} else {
			var totalValue = 0;
			lists.forEach(function (entry) {
				totalValue += entry.value;
			});
			return res.status(200).json(totalValue);
		}
	});
});

router.get('/clientinfo', function (req, res) {
	List.find().sort({'client.name': 1}).select('client').exec(function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists/clientinfo");
		} else {
			return res.status(200).json(lists);
		}
	});
});

router.get('/months', function (req, res) {
	List.find({checked: true}).distinct('checkMonth', function (err, checkMonths) {
		if (err) {
			return res.status(400).send("err in get /lists/months");
		} else {
			return res.status(200).json(checkMonths);
		}
	});
});

router.get('/:_id', function (req, res) {
	List.findById(req.params._id, function (err, list) {
		if (err) {
			return res.status(400).send("err in get /lists/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

module.exports = router;
