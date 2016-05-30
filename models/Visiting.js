var mongoose = require('mongoose');

var VisitingSchema = new mongoose.Schema({ //客户拜访
  year: String,
  season: String,
  week: String,
  date: {
    type: Date,
    default: Date.now,
  },
  saler: String,
  school: String,
  client_sort: {
    type: String,
    enum: ['A', 'B', 'C'],
  },
  new: Boolean, //新、老客户
  department: String,
  name: String,
  phone: String,
  result: String,
  opportunity: Boolean, //有商机
  money: Number,
  attached1: String,
  attached2: String,
  attached3: String,
  comment: String,
});

module.exports = mongoose.model('Visiting', VisitingSchema);
