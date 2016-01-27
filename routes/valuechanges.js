var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ValueChange = require('../models/ValueChange.js');

router.post('/', function (req, res) {
  ValueChange.create(req.body, function (err, valuechange) {
    if (err) {
      return res.status(400).send("err in post /valuechanges/");
    } else {
      return res.status(200).json(valuechange);
    }
  });
});

router.get('/', function (req, res) {
  var page = (req.query.page === undefined) ? 0 : req.query.page;
  var limit = (req.query.limit === undefined) ? 10 : req.query.limit;

  delete req.query.page;
  delete req.query.limit;
  
  ValueChange.find(req.query).skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, valuechanges) {
    if (err) {
      return res.status(400).send("err in get /valuechanges");
    } else {
      return res.status(200).json(valuechanges);
    }
  });
});

router.get('/:_id', function (req, res) {
  ValueChange.findById(req.params._id, function (err, valuechange) {
    if (err) {
      return res.status(400).send("err in get /valuechanges/:_id");
    } else {
      return res.status(200).json(valuechange);
    }
  });
});

router.post('/remove/:_id', function (req, res) {
  ValueChange.findByIdAndRemove(req.params._id, function (err, valuechange) {
    if (err) {
      return res.status(400).send("err in post /valuechanges/remove/:_id");
    } else {
      return res.status(200).json(valuechange);
    }
  });
});

module.exports = router;

