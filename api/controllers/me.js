module.exports = function(store) {
	return function(req, res) {
		if (req.identity.authenticated) {
			return store
				.get(req.identity.user.id)
				.then(res.success)
				.catch(() => res.failure('Invalid user.', 400));
		}

		return res.failure('You are not authenticated', 401);
	};
};
