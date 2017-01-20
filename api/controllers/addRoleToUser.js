module.exports = function(store) {
	return function(req, res) {
		const id = req.params.id;
		if (!req.identity.is(`admin@users/${id}`)) return res.failure('You do not have permissions to modify this object.', 403);
		store.addRole(id, req.body.role, req.body.scope);
		return res.success();
	};
};
