const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function (store) {
	return [requireAuthentication(), async function(req, res) {
		const role = req.params[1];
		const scope = req.params[2];
		const id = req.params[0];
		if (!req.identity.is(`admin@users/${id}`)) return res.failure('You do not have permissions to modify this object.', 403);
		const newRoles = await store.removeRole(id, role, scope);
		return res.success(newRoles);
	}];
};
