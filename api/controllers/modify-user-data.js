const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(req => `admin@users/${req.params.id}`),
		async function(req, res) {
			const id = req.params.id;
			const data = req.body;

			const result = await store.modifyUserData(id, data);
			return res.success(result);
		},
	];
};
