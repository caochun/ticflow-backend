var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({

	client: {
		name: String,
		address: String,
		phone_no: String,
		unit: String,
	},

	date: {
		type: Date,
		default: Date.now,
	},

	machineType: String,
	fixType: String,
	serviceType: String,

	reporter: String,
	
	engineer: {
		type: String,
		default: 'undispatched',
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('List', ListSchema);