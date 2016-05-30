var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var BidManagement = require('../../models/BidManagement.js');

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

	delete req.query.page;
	delete req.query.limit;

	BidManagement.find(req.query).skip(page * limit).limit(limit).sort({create_at: -1}).exec(function (err, bidding) {
		if (err) {
			return res.status(400).send("err in get /bidmanagement");
		} else {
			return res.status(200).json(bidding);
		}
	});
});

router.get('/months', function (req, res) {
	BidManagement.find({}).distinct('month', function (err, months) {
		if (err) {
			return res.status(400).send("err in get /bidmanagement/months");
		} else {
			return res.status(200).json(months);
		}
	});
});

router.get('/:_id', function (req, res) {
	BidManagement.findById(req.params._id, function (err, bidding) {
		if (err) {
			return res.status(400).send("err in get /bidmanagemeng/:_id");
		} else {
			return res.status(200).json(bidding);
		}
	});
});

module.exports = router;
