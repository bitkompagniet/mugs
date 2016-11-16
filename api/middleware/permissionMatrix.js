const rumor = require('rumor')('mugs:permissionMatrix');

const permissions = {
	view: 'view',
	editDetails: 'editDetails',
	editRoles: 'editRoles',
	changeMembership: 'changeMembership',
};

const matrix = {
	owner: [
		permissions.view,
		permissions.editRoles,
		permissions.editDetails,
		permissions.changeMembership,
	],
	admin: [
		permissions.view,
		permissions.editRoles,
		permissions.editDetails,
	],
	member: [
		permissions.view,
	],
};

function roleAndGroup(s) {
	const [role, group] = s.split('@');
	return { role, group };
}

function can(action, group, roleStrings) {
	if (!roleStrings || roleStrings.length === 0) return false;
	const roles = ((Array.isArray(roleStrings) && roleStrings) || [roleStrings]).map(roleAndGroup);
	return roles.some(i => (i.group === '*' || i.group === group) && matrix[i.role].includes(action));
}

module.exports = function() {
	rumor.info('Added permission matrix middleware.');
	return function(req, res, next) {
		const roles = req.identity.authenticated && req.identity.user.roles;
		req.rights = { can: (action, group, role = roles) => can(action, group, role) };

		Object.keys(permissions).forEach((key) => {
			req.rights[`can${key}`] = (group, role = roles) => can(key, group, role);
		});

		return next();
	};
};
