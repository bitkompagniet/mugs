const rumor = require('rumor')();
const _ = require('lodash');
const mail = require('../../lib/mail');

module.exports = function(store, config) {
	return async function(req, res) {
		try {
			const recoveryToken = await store.requestRecoveryToken(req.params.email);
			const user = await store.getByEmail(req.params.email);
			mail.recover(config.smtp, recoveryToken, config.appName, config.passwordRecoveryUrl, config.logoLink, user);
			res.success();
		} catch (e) {
			res.failure(e);
		}
	};
};
