var mongoose = require('mongoose');

var BidBondSchema = new mongoose.Schema({ //投标保证金
  serial_number: String,
  date: String,
  saler: String,
  client: String,
  projectName: String,
  money: Number,
  expectWithdrawTime: String,
  create_at: {
    type: Date,
    default: Date.now,
  },
  withdraw: {
    type: Boolean,
    default: false,
  },
  withdrawTime: String,
  withdrawMoney: String,
  comment: String,
  dlt: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('BidBond', BidBondSchema);
