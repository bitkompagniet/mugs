module.exports = function(store) {
	return async function(req, res, next) {
		const { email, password } = req.body;
		const recoveryToken = req.params.token;
		try {
			await store.changePasswordWithRecovery(email, recoveryToken, password);
			return res.success();
		} catch (e) {
			return next(e);
		}
	};
};
