var mongoose = require('mongoose');

var SalesReportSchema = new mongoose.Schema({ //销售报表
  serial_number: String,
  month: String,
  saler: String,
  task: Number,
  complete: Number,
  create_at: {
    type: Date,
    default: Date.now,
  },
  dlt: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('SalesReport', SalesReportSchema);
