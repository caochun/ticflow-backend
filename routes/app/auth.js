var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../../models/User.js');

router.post('/signin', function (req, res) {
	User.findOne(req.body, function (err, user) {
		if (err) {
			return res.status(400).send("err in post /auth/signin");
		} else {
			return res.status(200).json(user);
		}
	});
});

module.exports = router;
