const mercutio = require('mercutio');
const _ = require('lodash');

module.exports = function() {
	return function(req, res, next) {
		let addExtraRoles = null;
		let filteredRoles;
		if (req.body.roles) {
			filteredRoles = req.body.roles.filter(role => !((_.isPlainObject(role) && (!role.scope && role.role)) || (_.isString(role) && role.indexOf('@') === -1)));
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
				if (!req.identity.roles.is({ role: 'admin', scope: role.scope })) {
					return res.failure(`User lacked admin role of scope ${role.scope}, and could not post a user with these roles.`);
				}
			}
		}


		return next();
	};
};
