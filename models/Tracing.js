var mongoose = require('mongoose');

var TracingSchema = new mongoose.Schema({ //项目跟踪
  year: String,
  season: String,
  week: String,
  date: {
    type: Date,
    default: Date.now,
  },
  saler: String,
  school: String,
  department: String,
  name: String,
  phone: String,

  projectName: String,
  budget: Number,
  fund: Number,
  plan: String,
  percent: String,

  product: String,
  competitor: String,
  result: String,

  overview: String,
  summary: String,
  comment: String,
  
});

module.exports = mongoose.model('Tracing', TracingSchema);
