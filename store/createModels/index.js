const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function(uri) {
	var userSchema = new Schema({
		name: String,
		password: String,
		roles: [String],
		data: {}
	});
	return {
		users: mongoose.model('User', userSchema)
	};
}
