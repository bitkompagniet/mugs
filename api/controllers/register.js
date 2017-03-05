const rumor = require('rumor')('mugs:api:register');
const _ = require('lodash');
const mail = require('../../lib/mail');
const urlJoin = require('url-join');
const ensureFirstLastname = require('../middleware/ensure-first-last-name');

module.exports = function(store) {
	return [
		ensureFirstLastname(),

		async function(req, res, next) {
			try {
				const acceptedBody = _.pick(req.body, [
					'email',
					'firstname',
					'lastname',
					'password',
					'data',
				]);

				const result = await store.register(acceptedBody);

				const appUrl = req.configuration('appUrl');
				const mountPath = _.isArray(req.app.mountpath) ? req.app.mountpath[0] : req.app.mountpath;
				const confirmRegistrationUrl = urlJoin(appUrl, mountPath, '/register/', result.confirmationToken);

				rumor.debug(`Confirm registration URL: ${confirmRegistrationUrl}`);

				await mail.confirmation(req.configuration('smtp'), confirmRegistrationUrl, req.configuration('appName'), req.configuration('logoLink'), result.user);

				return res.success(result.user);
			} catch (e) {
				if (e.name === 'MongoError' && e.code === 11000) {
					return res.failure('User already exists.', 409);
				}
				return next(e);
			}
		},

	];
};
