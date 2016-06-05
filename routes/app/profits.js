var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var Profit = require('../../models/Profit.js');
var Factor = require('../../models/Factor.js');

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

router.get('/totalprofit', function (req, res) {
	var factor;
	var ep = new eventproxy();
	Factor.findOne({id: "default"}, function (err, data) {
		factor = data.value;
    	ep.emit('factor');
  	});
  	var totalprofit = 0;
  	ep.on('factor', function () {
  		Profit.find(req.query).distinct('month', function (err, months) {
  			if (months.length == 0)
  				return res.status(200).json(totalprofit);
			for (var i = 0; i < months.length; i++) {
	      		ep.on('month' + i, (function (i) {
	        		return function () {
	        			req.query.month = months[i];
	        			var curprofit = 0;
	          			Profit.find(req.query).exec(function (err, profit) {
	            			profit.forEach(function (entry) {
	            				if (entry.detail == "profit")
									curprofit += entry.money;
								else
									curprofit -= entry.money;
	            			});
	            			if (curprofit < 0)
	            				totalprofit += curprofit;
	            			else
	            				totalprofit += curprofit * factor;
	            			ep.emit('month' + (i + 1));
	          			});
	        		};
	      		})(i));
	    	}
	    	ep.emit('month' + 0);
	    	ep.on('month' + months.length, function () {
		  		return res.status(200).json(totalprofit);
		  	});
	    });
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
