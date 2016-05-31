var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var Visiting = require('../../models/Visiting.js');

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

	delete req.query.page;
	delete req.query.limit;

	Visiting.find(req.query).skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, visiting) {
		if (err) {
			return res.status(400).send("err in get /visiting");
		} else {
			return res.status(200).json(visiting);
		}
	});
});

router.post('/', function (req, res) {
	Visiting.create(req.body, function (err, visiting) {
      	if (err) {
       		return res.status(400).send("err in post /visiting");
      	} else {
        	return res.status(200).json(visiting);
      	}
    });
});

router.get('/:_id', function (req, res) {
	Visiting.findById(req.params._id, function (err, visiting) {
		if (err) {
			return res.status(400).send("err in get /visiting/:_id");
		} else {
			return res.status(200).json(visiting);
		}
	});
});

router.post('/:_id', function (req, res) {
	Visiting.findByIdAndUpdate(req.params._id, req.body, function (err, visiting) {
		if (err) {
			return res.status(400).send("err in put /visiting/:_id");
		} else {
			return res.status(200).json(visiting);
		}
	});
});

router.post('/remove/:_id', function (req, res) {
	Visiting.findByIdAndRemove(req.params._id, function (err, visiting) {
		if (err) {
			return res.status(400).send("err in post /visiting/remove/:_id");
		} else {
			return res.status(200).json(visiting);
		}
	});
});

module.exports = router;
