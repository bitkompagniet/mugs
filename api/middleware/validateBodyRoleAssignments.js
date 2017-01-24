const mercutio = require('mercutio');

module.exports = function() {
	return function(req, res, next) {
		let addExtraRoles = null;

		try {
			if (req.body.roles) addExtraRoles = mercutio(req.body.roles).toArray();
		} catch (e) {
			return res.failure('Roles array could not be properly parsed.', 422);
		}

		if (Array.isArray(addExtraRoles)) {
			for (const role of addExtraRoles) {
				if (!req.identity.is({ role: 'admin', scope: role.scope })) {
					return res.failure(`User lacked admin role of scope ${role.scope}, and could not post a user with these roles.`);
				}
			}
		}

		return next();
	};
};
