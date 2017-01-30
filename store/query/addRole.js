const mercutio = require('mercutio');

module.exports = async function (_id, role, scope) {
	await this.findOneAndUpdate({ _id }, {
		$addToSet: { roles: { role, scope } },
	});

	const user = await this.findById(_id);

	const newRoles = user.roles;
	const m = mercutio(newRoles);
	const rationalized = m.rationalize();

	user.roles = rationalized.toArray();
	user.save();

	return user.roles;
};
