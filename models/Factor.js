var mongoose = require('mongoose');

var FactorSchema = new mongoose.Schema({ //利润系数
  id: String,
  value: Number,
});

module.exports = mongoose.model('Factor', FactorSchema);
