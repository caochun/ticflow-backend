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
		enum: ['saler', 'engineer', 'manager', 'admin'],
	},
});

module.exports = mongoose.model('User', UserSchema);
