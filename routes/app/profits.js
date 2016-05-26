var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var Profit = require('../../models/Profit.js');

router.get('/expense', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

	delete req.query.page;
	delete req.query.limit;

	req.query.detail = {$ne: 'profit'};

	Profit.find(req.query).select('serial_number detail money comment').skip(page * limit).limit(limit).sort({create_at: -1}).exec(function (err, expense) {
		if (err) {
			return res.status(400).send("err in get /profits/expense");
		} else {
			return res.status(200).json(expense);
		}
	});
});

router.get('/totalexpense', function (req, res) {
	req.query.detail = {$ne: 'profit'};

	Profit.find(req.query, function (err, expense) {
		if (err) {
			return res.status(400).send("err in get /profits/totalexpense");
		} else {
			var totalexpense = 0;
			expense.forEach(function (entry) {
				totalexpense += entry.money;
			});
			return res.status(200).json(totalexpense);
		}
	});
});

router.get('/profit', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

	delete req.query.page;
	delete req.query.limit;

	req.query.detail = 'profit';

	Profit.find(req.query).select('serial_number money comment').skip(page * limit).limit(limit).sort({create_at: -1}).exec(function (err, profit) {
		if (err) {
			return res.status(400).send("err in get /profits/profit");
		} else {
			return res.status(200).json(profit);
		}
	});
});

router.get('/totalprofit', function (req, res) {
	req.query.detail = 'profit';

	Profit.find(req.query, function (err, profit) {
		if (err) {
			return res.status(400).send("err in get /profits/profit");
		} else {
			var totalprofit = 0;
			profit.forEach(function (entry) {
				totalprofit += entry.money;
			});
			return res.status(200).json(totalprofit);
		}
	});
});

router.get('/months', function (req, res) {
	Profit.find({}).distinct('month', function (err, months) {
		if (err) {
			return res.status(400).send("err in get /profits/months");
		} else {
			return res.status(200).json(months);
		}
	});
});

module.exports = router;
