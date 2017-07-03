const mercutio = require('mercutio');

module.exports = function() {
	return function(req, res, next) {
		let addExtraRoles = null;
		let filteredRoles;
		if (req.body.roles) {
			filteredRoles = req.body.roles.filter((role) => {
				if (typeof role === 'object') {
					if (!role.scope && role.role) {
						return null;
					}
					return role;
				}
				else if (typeof role === 'string') {
					if (role.indexOf('@') === -1) {
						return null;
					}
					return role;
				}
				return null;
			});
		} else {
			filteredRoles = req.body.roles;
		}


		try {
			if (filteredRoles) addExtraRoles = mercutio(filteredRoles).toArray();
		} catch (e) {
			return res.failure('Roles array could not be properly parsed.', 422);
		}
		if (Array.isArray(addExtraRoles)) {
			for (const role of addExtraRoles) {
				console.log('identity');
				console.log(req.identity.roles.toArray());
				console.log('role');
				console.log(role);
				if (!req.identity.roles.is({ role: 'admin', scope: role.scope })) {

					return res.failure(`User lacked admin role of scope ${role.scope}, and could not post a user with these roles.`);
				}
			}
		}

	//	if (addExtraRoles) req.body.roles = addExtraRoles;

		return next();
	};
};
