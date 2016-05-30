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
  
});

module.exports = mongoose.model('Tracing', TracingSchema);
