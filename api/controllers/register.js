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

				// const user = await store.insert(acceptedBody);
				// const rawUser = await store.getRaw(user._id);
				// await store.addRole(user._id, 'admin', `users/${user._id}`);
				// await store.addRole(user._id, 'member', `users/${user._id}`);

				const result = await store.register(acceptedBody);

				const appUrl = req.configuration('appUrl');
				const mountPath = _.isArray(req.app.mountpath) ? req.app.mountpath[0] : req.app.mountpath;
				const confirmRegistrationUrl = urlJoin(appUrl, mountPath, '/register/', result.confirmationToken);

				rumor.debug(`Confirm registration URL: ${confirmRegistrationUrl}`);
				await mail.confirmation(_.merge({}, result.user, req.configuration(), { confirmRegistrationUrl }));

				// const updatedUser = await store.get(user._id);
				return res.success(result.user);
			} catch (e) {
				return next(e);
			}
		},

	];
};
