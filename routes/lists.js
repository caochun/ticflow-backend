var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var List = require('../models/List.js');

router.post('/', function (req, res) {
	var list = req.body.list;

	List.create(list, function (err, list) {
		if (err) {
			return res.status(400).send("err in post /lists");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.get('/', function (req, res) {
	List.find(function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists");
		} else {
			return res.status(200).json(lists);
		}
	});
});

router.get('/undispatched', function (req, res) {
	List.find({engineer: 'undispatched'}, function (err, listsUndispatched) {
		if (err) {
			return res.status(400).send("err in get /lists/undispatched");
		} else {
			return res.status(200).json(listsUndispatched);
		}
	});
});

router.get('/uncompleted', function (req, res) {
	List.find({engineer: req.query.id, completed: false}, function (err, listsUncompleted) {
		if (err) {
			return res.status(400).send("err in get /lists/uncompleted");
		} else {
			return res.status(200).json(listsUncompleted);
		}
	});
});

router.get('/:id', function (req, res) {
	List.findOne({_id: req.params.id}, function (err, list) {
		if (err) {
			return res.status(400).send("err in get /lists/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.post('/:id', function (req, res) {
	List.findOneAndUpdate({_id: req.params.id}, req.body, function (err, list) {
		if (err) {
			return res.status(400).send("err in put /lists/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

module.exports = router;
