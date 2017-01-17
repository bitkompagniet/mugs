const _ = require('lodash');
const requireAuthentication = require('../middleware/requireAuthentication');
const mercutio = require('mercutio');

module.exports = function(store) {
	return [
		requireAuthentication(),

		async function(req, res, next) {
			try {
				const query = _.merge({}, req.query, {
					roles: req.identity.user.roles,
				});

				let result = await store.list(query);

				if (req.query.role) {
					const requiredUserRoles = mercutio(req.query.role);
					result = result.filter(user => mercutio(user.roles).isAny(requiredUserRoles));
				}

				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},
	];
};
