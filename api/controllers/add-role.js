const requireRole = require('../middleware/require-role');

module.exports = function(store) {
	return [
		requireRole(req => `admin@${req.body.scope}`),

		async function(req, res) {
			const newRoles = await store.addRoles(req.params.id, [{ role: req.body.role, scope: req.body.scope }]);
			return res.success(newRoles);
		},
	];
};
