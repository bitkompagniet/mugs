module.exports = function(store) {
	return async function(req, res, next) {
		try {
			const body = req.body;
			await store.changePassword(req.identity.user._id, body.password, body.repeated, body.new);
			return res.success();
		} catch (e) {
			return res.failure(e.message);
		}
	};
};
