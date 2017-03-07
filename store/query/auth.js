const passwordHash = require('../util/passwordHash');
const moment = require('moment');

module.exports = async function(email, password) {
	const hash = passwordHash(password);
	const user = await this.findOne({ email });// the user has to be checked for locked whether the password was correct or not.

	if (user.locked && moment().isBefore(user.locked)) {
		throw { Error: 'LockError', retry: user.locked };
	}

	if (user.password === hash) {
		user.failedAttempts = 0;
		user.locked = null;
		await user.save();
		return user.toJSON();
	}

	const time = 250 * user.failedAttempts;
	const lockedTill = moment().add(time, 'ms');
	await this.findOneAndUpdate({ email }, { $set: { failedAttempts: user.failedAttempts + 1, locked: lockedTill } });
	throw new Error('Wrong e-mail or password');
};
