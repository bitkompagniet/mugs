module.exports = function (store) {
	return async function(req, res) {
		if (!req.identity.is('admin@users')) {
			return res.failure('You don\'t have permission to delete a user.');
		}

		const err = await store.delete(req.params.id);
		if (!err) {
			return await res.success();
		}
		return await res.failure(err);
	};
};
