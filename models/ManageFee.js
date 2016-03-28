var mongoose = require('mongoose');

var ManageFeeSchema = new mongoose.Schema({ //总经办支出
  month: String,
  usage: String,
  money: Number,
  comment: String,
  create_at: {
    type: Date,
    default: Date.now,
  },
  dlt: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('ManageFee', ManageFeeSchema);
