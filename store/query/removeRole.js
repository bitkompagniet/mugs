const mercutio = require('mercutio');

module.exports = async function (_id, role, scope) {
	const user = await this.findById(_id);
	const rolesWeWantToDelete = mercutio({ role, scope });

	const newRoles = user.roles.filter(currentRole => !rolesWeWantToDelete.is(currentRole));
	user.roles = newRoles;
	user.save();


	return user;
};
