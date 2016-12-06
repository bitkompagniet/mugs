const rumor = require('rumor')('mugs:api:register');
const _ = require('lodash');
const mail = require('../../lib/mail');
const urlJoin = require('url-join');

module.exports = function(store) {
	return async function(req, res, next) {
		try {
			const appUrl = req.configuration('appUrl');
			const mountPath = _.isArray(req.app.mountpath) ? req.app.mountpath[0] : req.app.mountpath;
			const user = await store.create(_.pick(req.body, ['email', 'fullname', 'password', 'data']));
			const rawUser = await store.getRaw(user._id);
			const confirmRegistrationUrl = urlJoin(appUrl, mountPath, '/register/', rawUser.confirmationToken);
			rumor.debug(`Confirm registration URL: ${confirmRegistrationUrl}`);
			await mail.confirmation(_.merge({}, user, req.configuration(), { confirmRegistrationUrl }));
			return res.success(user);
		} catch (e) {
			return next(e);
		}
	};
};
