const passwordGenerator = require('password-generator');
const _ = require('lodash');

function sortRoles(roles) {
	const rolesWithoutScope = [];
	const rolesWithScope = [];
	roles.forEach(function(role) {
		if (typeof role === 'object') {
			if (!role.scope) {
				rolesWithoutScope.push(role.role);
			} else {
				rolesWithScope.push(role);
			}
		} else {
			if (role.split('@').length === 1) {
				rolesWithoutScope.push(role);
			} else {
				const splittedRole = role.split('@');
				rolesWithScope.push({ role: splittedRole[0], scope: splittedRole[1] });
			}
		}
	}, this);
	return { rolesWithoutScope, rolesWithScope };
}

module.exports = async function(body) {
	let rolesWithoutScope;
	let rolesWithScope;
	body.password = (body.password) ? body.password : passwordGenerator(8);
	if (body.roles) {
		const sortedRoles = sortRoles(body.roles);
		rolesWithoutScope = sortedRoles.rolesWithoutScope;
		rolesWithScope = sortedRoles.rolesWithScope;
		body.roles = rolesWithScope;
	}
	const user = await this.create(body);
	await this.configureDefaultRoles(user._id);
	await this.confirmRegistration(user.confirmationToken);
	const newUser = await this.get(user._id);
	const OwnScopeRoles = _.map(rolesWithoutScope, roleWithOutScope => ({ role: roleWithOutScope, scope: `users/${newUser.id}` }));
	await this.addRoles(newUser.id, OwnScopeRoles);
	newUser.password = body.password;
	return newUser;
};


