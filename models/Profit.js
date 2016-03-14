var mongoose = require('mongoose');

var ProfitSchema = new mongoose.Schema({
  month: String,
  saler: String,
  detail: {
    type: String,
    enum: ['profit', 'travel', 'entertainment', 'bidding', 'brokerage', 'others'],
  },
  money: Number,
  comment: String,
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profit', ProfitSchema);
