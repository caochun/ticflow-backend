var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var List = require('../models/List.js');

router.post('/', function (req, res) {
	List.create(req.body, function (err, list) {
		if (err) {
			return res.status(400).send("err in post /lists");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : req.query.limit;

	delete req.query.page;
	delete req.query.limit;

	if (req.query.accepted == 'false') {
		List.find(req.query).select('client saler engineer date').skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, lists) {
			if (err) {
				return res.status(400).send("err in get /lists");
			} else {
				return res.status(200).json(lists);
			}
		});
	} else if (req.query.accepted == 'true' && req.query.completed == 'false') {
		List.find(req.query).select('client saler engineer acceptTime').skip(page * limit).limit(limit).sort({acceptTime: -1}).exec(function (err, lists) {
			if (err) {
				return res.status(400).send("err in get /lists");
			} else {
				return res.status(200).json(lists);
			}
		});
	} else if (req.query.completed == 'true' && req.query.checked == 'false') {
		List.find(req.query).select('client saler engineer completeTime').skip(page * limit).limit(limit).sort({completeTime: -1}).exec(function (err, lists) {
			if (err) {
				return res.status(400).send("err in get /lists");
			} else {
				return res.status(200).json(lists);
			}
		});
	} else if (req.query.checked == 'true') {
		List.find(req.query).select('client saler engineer checkTime').skip(page * limit).limit(limit).sort({checkTime: -1}).exec(function (err, lists) {
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
	List.find().sort({date: -1}).select('client').exec(function (err, lists) {
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
