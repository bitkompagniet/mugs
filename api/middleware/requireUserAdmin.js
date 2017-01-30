module.exports = function() {
	return function(req, res, next) {
		if (!req.identity.is('admin@users')) {
			return res.failure('You don\'t have permission to create a user.');
		}

		return next();
	};
};
