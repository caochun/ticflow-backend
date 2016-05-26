var express = require('express');
var router = express.Router();
var eventproxy = require('eventproxy');

var mongoose = require('mongoose');
var Prestore = require('../../models/Prestore.js');

router.get('/total', function (req, res) {
  Prestore.find(req.query).sort({create_at: -1}).exec(function (err, prestore) {
    if (err) {
      return res.status(400).send("err in get /prestore/total");
    } else {
      var total = [];
        prestore.forEach(function (entry) {
          var i;
          for (i = 0; i < total.length; i++) {
            if (total[i].client == entry.client && total[i].contacter == entry.contacter) {
              if (entry.detail == "income") total[i].account += entry.money;
              else total[i].account -= entry.money;
              break;
            }
          }
          if (i == total.length) {
            var account = (entry.detail == "income") ? entry.money : (- entry.money);
            total[i] = {saler: entry.saler, client: entry.client, contacter: entry.contacter, account: account};
          }
        });
      return res.status(200).json(total);
    }
  });
});

router.get('/detail', function (req, res) {
  var page = (req.query.page === undefined) ? 0 : req.query.page;
  var limit = (req.query.limit === undefined) ? 10 : parseInt(req.query.limit);

  delete req.query.page;
  delete req.query.limit;
  
  Prestore.find(req.query).sort({create_at: -1}).exec(function (err, prestore) {
    if (err) {
      return res.status(400).send("err in get /prestore/detail");
    } else {
      return res.status(200).json(prestore);
    }
  });
});

module.exports = router;
