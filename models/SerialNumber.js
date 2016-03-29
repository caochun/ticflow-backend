var mongoose = require('mongoose');

var SerialNumberSchema = new mongoose.Schema({ //编号
  id: String,
  date: String,
  value: Number,
});

module.exports = mongoose.model('SerialNumber', SerialNumberSchema);
