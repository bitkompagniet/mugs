const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [
		requireAuthentication(),

		async function(req, res) {
			if (!req.identity.is('admin@users')) {
				return res.failure('You don\'t have permission to create a user.');
			}

			try {
				const user = await store.create(req.body);
				await store.addRole(user._id, 'admin', `users/${user._id}`);
				await store.addRole(user._id, 'member', `users/${user._id}`);

				const userWithRoles = await store.get(user._id);

				return res.success(userWithRoles);
			} catch (e) {
				return res.failure(e.message);
			}
		},
	];
};
