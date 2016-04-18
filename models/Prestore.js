var mongoose = require('mongoose');

var PrestoreSchema = new mongoose.Schema({ //现金流水
  date: String,
  saler: String,
  client: String,
  contacter: String,
  detail: {
    type: String,
    enum: ['income', 'expense'],
  },
  invoice_number: String,
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

module.exports = mongoose.model('Prestore', PrestoreSchema);
