const jsonwebtoken = require('jsonwebtoken');

module.exports = function(store, secret) {
	return function(req, res) {
		store.login(req.body.email, req.body.password)
			.then(user => ({
				token: jsonwebtoken.sign(user, secret),
				user,
			}))
			.then(res.success)
			.catch(err => res.failure(err, 401));
	};
};
