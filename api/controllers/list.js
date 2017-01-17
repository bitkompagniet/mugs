const _ = require('lodash');
const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [
		requireAuthentication(),

		async function(req, res, next) {
			if (!req.identity.is(`admin@users/${req.params.id}`)) return res.failure('');
			try {
				const query = _.merge({}, req.query, {
					roles: req.identity.user.roles,
				});

				const result = await store.list(query);
				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},
	];
};
