var mongoose = require('mongoose');

var BidManagementSchema = new mongoose.Schema({ //投标管理
  serial_number: String,
  month: String,
  saler: String,
  client: String,
  projectName: String,
  link: String,
  win: Boolean,
  competitor: String,
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

module.exports = mongoose.model('BidManagement', BidManagementSchema);
