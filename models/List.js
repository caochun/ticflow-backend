var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({

	clientName: String,
	clientAddress: String,
	clientPhoneNumber: String,
	clientUnit: String,

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