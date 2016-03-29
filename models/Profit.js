var mongoose = require('mongoose');

var ProfitSchema = new mongoose.Schema({ //毛利
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
  serial_number: String,
  dlt: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Profit', ProfitSchema);
