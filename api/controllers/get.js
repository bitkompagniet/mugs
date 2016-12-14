const requireAuthentication = require('../middleware/requireAuthentication');
const mercutio = require('mercutio');

module.exports = function(store) {
	const before = [requireAuthentication()];

	const controller = async function(req, res, next) {
		try {
			const user = await store.get(req.params.id);
			const targetRoles = mercutio(user.roles).whereRoleIs('admin', 'member');
			const isAllowed = mercutio(req.identity.roles).isAny(targetRoles);

			if (!isAllowed) return res.failure('Forbidden.', 403);

			return res.success(user);
		} catch (e) {
			return next(e);
		}
	};

	return [...before, controller];
};
