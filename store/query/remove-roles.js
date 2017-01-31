const mercutio = require('mercutio');

module.exports = async function (_id, roles) {
	const user = await this.findById(_id);

	for (const { role, scope } of roles) {
		const rolesWeWantToDelete = mercutio({ role, scope });
		const newRoles = user.roles.filter(currentRole => !rolesWeWantToDelete.is(currentRole));
		user.roles = newRoles;
	}

	await user.save();
	return user;
};
