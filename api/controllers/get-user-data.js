const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(req => `member@users/${req.params.id}`),

		async function(req, res, next) {
			try {
				const data = await store.getUserData(req.params.id);
				return res.success(data);
			} catch (e) {
				return next(e);
			}
		},
	];
};
