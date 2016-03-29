var mongoose = require('mongoose');

var CashFlowSchema = new mongoose.Schema({ //现金流水
  month: String,
  detail: {
    type: String,
    enum: ['income', 'expense'],
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

module.exports = mongoose.model('CashFlow', CashFlowSchema);
