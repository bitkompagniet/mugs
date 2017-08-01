const passwordHash = require('../util/passwordHash');

module.exports = async function(email, recoveryToken, newPassword) {
	const user = await this.getByEmail(email);
	const rawUser = await this.findById(user.id);
	if (rawUser.resetPasswordToken && recoveryToken == rawUser.resetPasswordToken) {
		try {
			rawUser.password = newPassword;
			rawUser.resetPasswordToken = null;
			await rawUser.validateSync();
			await rawUser.save();
		} catch (e) {
			throw new Error(e);
		}
	} else {
		throw new Error('Recovery token was wrong or expired.');
	}
};
