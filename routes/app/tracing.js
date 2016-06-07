var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var Tracing = require('../../models/Tracing.js');

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

	delete req.query.page;
	delete req.query.limit;

	Tracing.find(req.query).skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, tracing) {
		if (err) {
			return res.status(400).send("err in get /tracing");
		} else {
			return res.status(200).json(tracing);
		}
	});
});

router.get('/months', function (req, res) {
	Tracing.find({}).distinct('month', function (err, months) {
		if (err) {
			return res.status(400).send("err in get /tracing/months");
		} else {
			return res.status(200).json(months);
		}
	});
});


router.post('/', function (req, res) {
	Tracing.create(req.body, function (err, tracing) {
      	if (err) {
       		return res.status(400).send("err in post /tracing");
      	} else {
        	return res.status(200).json(tracing);
      	}
    });
});

router.get('/:_id', function (req, res) {
	Tracing.findById(req.params._id, function (err, tracing) {
		if (err) {
			return res.status(400).send("err in get /tracing/:_id");
		} else {
			return res.status(200).json(tracing);
		}
	});
});

router.post('/:_id', function (req, res) {
	Tracing.findByIdAndUpdate(req.params._id, req.body, function (err, tracing) {
		if (err) {
			return res.status(400).send("err in put /tracing/:_id");
		} else {
			return res.status(200).json(tracing);
		}
	});
});

router.post('/remove/:_id', function (req, res) {
	Tracing.findByIdAndRemove(req.params._id, function (err, tracing) {
		if (err) {
			return res.status(400).send("err in post /tracing/remove/:_id");
		} else {
			return res.status(200).json(tracing);
		}
	});
});

module.exports = router;
