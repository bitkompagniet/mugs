const mercutio = require('mercutio');

module.exports = async function (_id, role, scope) {
	const user = await this.findById(_id);
	const oldRolesLength = user.roles.length;

	await this.findOneAndUpdate({ _id }, {
		$addToSet: { roles: { role, scope } },
	});

	const newUser = await this.findById(_id);

	const newRoles = newUser.roles;
	const m = mercutio(newRoles);
	const rationalized = m.rationalize();
	newUser.roles = rationalized.toArray();
	newUser.save();

	if (newUser.roles.length > oldRolesLength) {
		return 201; // 201: created
	}
	return 200;
};
