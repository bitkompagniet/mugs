const jsonwebtoken = require('jsonwebtoken');
const tokenExpiry = require('../../lib/token-expiry');

module.exports = function(store, secret) {
	return function(req, res) {
		if (req.identity.authenticated) {
			return store
				.get(req.identity.user.id)
				.then(user => ({
					refresh: jsonwebtoken.sign(Object.assign({}, user, { exp: tokenExpiry() }), secret),
					user,
				}))
				.then(res.success)
				.catch(() => res.failure('Invalid user.', 400));
		}

		return res.failure('You are not authenticated', 401);
	};
};
