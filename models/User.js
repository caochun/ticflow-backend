var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		trim: true,
		required: 'Username is required',
	},
	
	password: String,

	role: {
		type: String,
		enum: ['treasurer', 'saler', 'engineer', 'manager', 'admin'],
	},

	frozen: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('User', UserSchema);
