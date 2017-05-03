const passwordHash = require('../util/passwordHash');

module.exports = async function(id, body) {
	try {
		const user = await this.findById(id);
		if (passwordHash(body.current) === user.password) {
			if (body.new === body.repeated) {
				user.password = body.new;
				const err = await user.validateSync();
				if (err) throw new Error(err);
				await user.save();
			} else {
				throw new Error('Repeated password was incorrect.');
			}
		} else {
			throw new Error('Entered password was incorrect.');
		}
	} catch (e) {
		throw new Error(e);
	}
};
