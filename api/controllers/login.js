const jsonwebtoken = require('jsonwebtoken');
const tokenExpiry = require('../../lib/token-expiry');

module.exports = function(store, secret) {
	return function(req, res) {
		store.login(req.body.email, req.body.password)
			.then(user => ({
				token: jsonwebtoken.sign(Object.assign(user, { exp: tokenExpiry() }), secret),
				user,
			}))
			.then(res.success)
			.catch(err => res.failure(err, 401));
	};
};
