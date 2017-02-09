const ensureFirstLastname = require('../middleware/ensure-first-last-name');
const requireRole = require('../middleware/require-role');
const allowedBodyProperties = require('../middleware/allowed-body-properties');

module.exports = function(store) {
	return [
		requireRole(req => `admin@users/${req.params.id}`),
		allowedBodyProperties(['email', 'name', 'lastname', 'fullname']),
		ensureFirstLastname(),

		async function(req, res, next) {
			try {
				const result = await store.modify(req.params.id, req.allowedBody);
				return res.success(result);
			} catch (e) {
				return next(e);
			}
		},

	];
};
