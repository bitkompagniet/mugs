const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = function () {
	const userSchema = new Schema({
		// Required
		email: { type: String, required: true },
		fullname: { type: String, required: true },
		password: { type: String, required: true },
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: null },
		confirmationToken: { type: Schema.Types.ObjectId },
		confirmed: { type: Date, default: null },
		resetPasswordToken: { type: String, default: null },
		roles: [String],
		groups: [String],
		data: {},
	});

	return {
		users: mongoose.model('User', userSchema),
	};
};
