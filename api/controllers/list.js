const _ = require('lodash');
const mercutio = require('mercutio');
const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(),

		async function(req, res, next) {
			try {
				const query = _.merge({}, req.query, {
					roles: req.identity.user.roles,
				});
				console.log(query);

				let result;
				if (req.query.role) {
					if (req.query.role.indexOf('@') === -1) {
						result = await store.list(query, req.query.role);
						result = result.filter(user => mercutio(user.roles).whereIs(req.query.role));
					} else {
						result = await store.list(query);
						const requiredUserRoles = mercutio(req.query.role);
						result = result.filter(user => mercutio(user.roles).isAny(requiredUserRoles));
					}
				}

				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},
	];
};
