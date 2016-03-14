var mongoose = require('mongoose');

var ManageFeeSchema = new mongoose.Schema({
  month: String,
  usage: String,
  money: Number,
  comment: String,
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ManageFee', ManageFeeSchema);
