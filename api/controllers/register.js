const rumor = require('rumor')('mugs:api:register');
const _ = require('lodash');
const mail = require('../../lib/mail');
const urlJoin = require('url-join');
const ensureFirstLastname = require('../middleware/ensureFirstLastname');

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

				const user = await store.create(acceptedBody);
				const rawUser = await store.getRaw(user._id);
				await store.addRole(user._id, 'admin', `users/${user._id}`);
				await store.addRole(user._id, 'member', `users/${user._id}`);

				const appUrl = req.configuration('appUrl');
				const mountPath = _.isArray(req.app.mountpath) ? req.app.mountpath[0] : req.app.mountpath;
				const confirmRegistrationUrl = urlJoin(appUrl, mountPath, '/register/', rawUser.confirmationToken);

				rumor.debug(`Confirm registration URL: ${confirmRegistrationUrl}`);
				await mail.confirmation(_.merge({}, user, req.configuration(), { confirmRegistrationUrl }));

				const updatedUser = await store.get(user._id);
				return res.success(updatedUser);
			} catch (e) {
				return next(e);
			}
		},

	];
};
