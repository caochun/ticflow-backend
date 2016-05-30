var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var SalesReport = require('../../models/SalesReport.js');

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

	delete req.query.page;
	delete req.query.limit;

	SalesReport.find(req.query).select('month saler task complete comment').skip(page * limit).limit(limit).sort({create_at: -1}).exec(function (err, forms) {
		if (err) {
			return res.status(400).send("err in get /salesreport");
		} else {
			return res.status(200).json(forms);
		}
	});
});

router.get('/months', function (req, res) {
	SalesReport.find({}).distinct('month', function (err, months) {
		if (err) {
			return res.status(400).send("err in get /salesreport/months");
		} else {
			return res.status(200).json(months);
		}
	});
});

module.exports = router;
