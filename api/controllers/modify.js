module.exports = function(store) {
	return async function(req, res) {
		const id = req.body._id;
		const body = req.body;

		if (!req.identity.is(`admin@users/${id}`)) return res.failure('You do not have permissions to modify this object.', 403);

		try {
			const result = await store.modify(body);
			return res.success(result);
		} catch (e) {
			return res.failure(e.message, 400);
		}
	};
};
