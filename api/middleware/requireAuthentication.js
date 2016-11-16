module.exports = function() {
	return function(req, res, next) {
		if (req.identity.authenticated) {
			return next();
		}

		return res.failure('Authentication required.', 401);
	};
};
