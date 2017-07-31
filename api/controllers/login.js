const jsonwebtoken = require('jsonwebtoken');
const tokenExpiry = require('../../lib/token-expiry');

module.exports = function(store, unconfirmedLogins) {
	return async function(req, res) {
		if (!(req.body.email && req.body.password)) {
			return res.failure('E-mail and password required.', 400);
		}



		try {
			const user = await store.login(req.body.email, req.body.password);
			const token = {
				token: jsonwebtoken.sign(Object.assign(user, { exp: tokenExpiry() }), req.configuration('secret')),
				user,
			};
			console.log(unconfirmedLogins)
			if (user.confirmed == null && !unconfirmedLogins) return res.failure('User not confirmed.', 403);

			return res.success(token);
		} catch (e) {
			return res.failure('Invalid credentials.', 401);
		}
	};
};
