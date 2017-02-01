const requireRole = require('../middleware/require-role');

module.exports = function (store) {
	return [
		requireRole(req => `admin@users/${req.params[0]}`),

		async function(req, res) {
			const role = req.params[1];
			const scope = req.params[2];
			const id = req.params[0];
			const newRoles = await store.removeRoles(id, [{ role, scope }]);
			return res.success(newRoles);
		},
	];
};
