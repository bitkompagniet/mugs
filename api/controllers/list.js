const _ = require('lodash');
const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [
		requireAuthentication(),

		async function(req, res, next) {
			try {
				const query = _.merge({}, req.query, {
					roles: req.identity.roles.toArray(),
				});

				const result = await store.list(query);
				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},
	];
};
