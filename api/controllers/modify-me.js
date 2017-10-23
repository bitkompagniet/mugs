const requireRole = require('../middleware/require-role');
const ensureFirstLastName = require('../middleware/ensure-first-last-name');
const allowedBodyProperties = require('../middleware/allowed-body-properties');
const jsonwebtoken = require('jsonwebtoken');
const tokenExpiry = require('../../lib/token-expiry');

module.exports = function(store, secret) {
	return [
		requireRole(),
		ensureFirstLastName(),
		allowedBodyProperties(['email', 'name', 'lastname', 'firstname', 'lastname']),

		async function(req, res, next) {
			try {
				const user = await store.get(req.identity.user._id);
				jsonwebtoken.sign(Object.assign({}, user, { exp: tokenExpiry() }), secret);

				const result = await store.modify(req.identity.user._id, req.allowedBody);
				return res.success(result);
			} catch (e) {
				if (e.name === 'AdminEmailChangeError') {
					return res.failure(e.message);
				}
				return next(e);
			}
		},
	];
};
