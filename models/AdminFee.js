var mongoose = require('mongoose');

var AdminFeeSchema = new mongoose.Schema({
  month: String,
  detail: {
    type: String,
    enum: ['rent', 'property', 'social', 'tax', 'utilities', 'salary', 'telebill', 'carriage', 'company', 'birthday', 'gas', 'interest', 'reserved', 'others'],
  },
  money: Number,
  comment: String,
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminFee', AdminFeeSchema);
