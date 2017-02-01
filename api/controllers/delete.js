const requireRole = require('../middleware/require-role');

module.exports = function (store) {
	return [
		requireRole(req => `admin@users/${req.params.id}`),

		async function(req, res, next) {
			try {
				await store.delete(req.params.id);
				return res.success();
			} catch (e) {
				return next(e);
			}
		},
	];
};
