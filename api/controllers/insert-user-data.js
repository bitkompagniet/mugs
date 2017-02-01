const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(req => `admin@users/${req.params.id}`),

		async function(req, res) {
			const id = req.params.id;
			const data = req.body.data;

			await store.insertUserData(id, data);
			return res.success();
		},
	];
};
