const jsonwebtoken = require('jsonwebtoken');
const tokenExpiry = require('../../lib/token-expiry');

module.exports = function() {
	return function(req, res) {
		const { token } = req.params;

		try {
			const user = jsonwebtoken.verify(token, req.configuration('secret'));
			user.exp = tokenExpiry();
			const refresh = jsonwebtoken.sign(user, req.configuration('secret'));

			return res.success({
				refresh,
				user,
			});
		} catch (e) {
			return res.failure('The token was invalid (malformatted or expired).', 400);
		}
	};
};
