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
				let result = await store.list(query);
				const requiredUserRoles = mercutio(req.identity.user.roles);
				result = result.filter(user => mercutio(requiredUserRoles).isAny(user.roles));

				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},
	];
};
