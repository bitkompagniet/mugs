const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function (store) {
	return [requireAuthentication(), async function(req, res) {
		const id = req.params.id;
		if (!req.identity.is(`admin@users/${id}`)) return res.failure('You do not have permissions to modify this object.', 403);
		const newRoles = await store.removeRole(id, req.body.role, req.body.scope);
		return res.success(newRoles);
	}];
};
