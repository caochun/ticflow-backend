var mongoose = require('mongoose');

var ValueChangeSchema = new mongoose.Schema({

  oldValue: Number,

  newValue: Number,

  manager: String,
  
  list_id: String,

  date: {
    type: Date,
    default: Date.now,
  },

  read: {
    type: Boolean,
    default: false
  },

});

module.exports = mongoose.model('ValueChange', ValueChangeSchema);
