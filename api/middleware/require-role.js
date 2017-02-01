const rumor = require('rumor')('mugs:middleware:requireRole');
const _ = require('lodash');

module.exports = function(roleResolver) {
	return function(req, res, next) {
		const role = _.isFunction(roleResolver) ? roleResolver(req) : roleResolver;

		if (!req.identity.authenticated) {
			return res.failure('You are not authenticated.', 401);
		}

		if (role && !req.identity.is(role)) {
			rumor.info(`Permission denied for ${req.identity.user.email}. Needed ${role}.`);
			return res.failure('You do not have the appropriate permissions to perform this action.', 403);
		}

		return next();
	};
};
