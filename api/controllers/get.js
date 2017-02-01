const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(req => `member@users/${req.params.id}`),

		async function(req, res, next) {
			try {
				const user = await store.get(req.params.id);
				return res.success(user);
			} catch (e) {
				return next(e);
			}
		},
	];
};
