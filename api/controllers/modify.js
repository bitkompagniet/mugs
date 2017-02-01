const ensureFirstLastname = require('../middleware/ensure-first-last-name');
const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(req => `admin@users/${req.params.id}`),
		ensureFirstLastname(),

		async function(req, res, next) {
			try {
				const result = await store.modify(req.params.id, req.body);
				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},

	];
};
