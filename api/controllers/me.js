const jsonwebtoken = require('jsonwebtoken');
const tokenExpiry = require('../../lib/token-expiry');
const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store, secret) {
	return [
		requireAuthentication(),

		async function(req, res) {
			try {
				const user = await store.get(req.identity.user._id);
				const freshIdentity = {
					refresh: jsonwebtoken.sign(Object.assign({}, user, { exp: tokenExpiry() }), secret),
					user,
				};

				return res.success(freshIdentity);
			} catch (e) {
				return res.failure('Token invalid.', 400);
			}
		},
	];
};
