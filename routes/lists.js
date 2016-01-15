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
	List.find(req.query, function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists");
		} else {
			return res.status(200).json(lists);
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
