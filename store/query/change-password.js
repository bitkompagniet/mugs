const passwordHash = require('../util/passwordHash');
const salt = require('../util/salt');

module.exports = async function(id, password, repeated, newPassword) {
	const user = await this.findById(id);
	if (passwordHash(password + user.salt) === user.password) {
		if (password === repeated) {
			user.salt = salt();
			user.password = newPassword + user.salt;
			const err = await user.validateSync();
			if (err) throw new Error(err);
			await user.save();
		} else {
			throw new Error('Repeated password was incorrect.');
		}
	} else {
		throw new Error('Entered password was incorrect.');
	}
};
