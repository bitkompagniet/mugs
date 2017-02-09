const ensureFirstLastname = require('../middleware/ensure-first-last-name');
const requireRole = require('../middleware/require-role');
const util = require('util');

module.exports = function(store) {
	return [
		requireRole(req => `admin@users/${req.params.id}`),
		ensureFirstLastname(),

		async function(req, res, next) {
			try {
				const result = await store.modify(req.params.id, req.body);
				return res.success(result);
			} catch (e) {
				if (e.name === 'AdminEmailChangeError') {
					return res.failure(e.message);
				}
				return next(e);
			}
		},

	];
};
