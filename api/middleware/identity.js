const jsonwebtoken = require('jsonwebtoken');

module.exports = function (secret) {
	return function(req, res, next) {
		const authorizationHeader = req.header('Authorization');

		if (!authorizationHeader) {
			req.identity = null;
			next();
		}

		jsonwebtoken.verify(authorizationHeader, secret, function (err, decoded) {
			if (err) throw new Error('Invalid Authorization token.');
			req.identity = decoded;
			next();
		});
	};
};
