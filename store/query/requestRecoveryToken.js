const rumor = require('rumor')('mugs:query:requestRecoveryToken');
const mongoose = require('mongoose');

module.exports = function(email) {
	return this.getByEmail(email)
		.then(rumor.trace)
		.then((user) => {
			if (user.confirmed == null) throw new Error('Cannot request new password for unconfirmed user.');
			return user;
		})
		.then(user =>
			this.findOneAndUpdate({ _id: user._id }, {
				$set: {
					resetPasswordToken: new mongoose.Types.ObjectId(),
				},
			}, { new: true })
		)
		.then(rumor.trace)
		.then(user => user.resetPasswordToken);
};
