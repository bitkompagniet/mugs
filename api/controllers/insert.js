const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [
		requireAuthentication(),

		async function(req, res, next) {
			if (!req.identity.is('admin@users')) {
				return res.failure('You don\'t have permission to create a user.');
			}

			try {
				const user = await store.insert(req.body);
				await store.addRole('admin', `users/${user._id}`);
				await store.addRole('member', `users/${user._id}`);

				return res.success(user);
			} catch (e) {
				return next(e);
			}
		},
	];
};
