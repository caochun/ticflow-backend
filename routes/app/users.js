var express = require('express');
var router = express.Router();
var uuid = require("node-uuid");

var mongoose = require('mongoose');
var User = require('../../models/User.js');
var List = require('../../models/List.js');

router.post('/create', function (req, res) {
	req.body.token = uuid.v4();
	User.create(req.body, function (err, user) {
		if (err) {
			return res.status(400).send("err in post /users/create");
		} else {
			return res.status(200).json(user);
		}
	});
});

router.post('/remove/:_id', function (req, res) {
	User.findByIdAndRemove(req.params._id, function (err, user) {
		if (err) {
			return res.status(400).send("err in post /users/remove/:_id");
		} else {
			return res.status(200).json(user);
		}
	});
});

router.post('/update/:_id', function (req, res) {
	User.findByIdAndUpdate(req.params._id, req.body, function (err, user) {
		if (err) {
			return res.status(400).send("err in post /users/update/:_id");
		} else {
			return res.status(200).json(user);
		}
	});
});

router.get('/', function (req, res) {
	User.find(req.query).sort({role: -1, id: -1}).exec(function (err, users) {
		if (err) {
			return res.status(400).send("err in get /users");
		} else {
			return res.status(200).json(users);
		}
	});
});

module.exports = router;

