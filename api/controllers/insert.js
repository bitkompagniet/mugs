const requireAuthentication = require('../middleware/requireAuthentication');
const allowedBodyProperties = require('../middleware/allowedBodyProperties');
const ensureFirstLastname = require('../middleware/ensureFirstLastname');
const requireUserAdmin = require('../middleware/requireUserAdmin');
const validateBodyRoleAssignments = require('../middleware/validateBodyRoleAssignments');

module.exports = function(store) {
	return [
		requireAuthentication(),
		requireUserAdmin(),
		ensureFirstLastname(),
		validateBodyRoleAssignments(),
		allowedBodyProperties(['email', 'firstname', 'lastname', 'password', 'data', 'roles']),

		async function(req, res) {
			try {
				const user = await store.insert(req.allowedBody);

				await Promise.all([
					store.addRole(user._id, 'admin', `users/${user._id}`),
					store.addRole(user._id, 'member', `users/${user._id}`),
				]);

				const userWithRoles = await store.get(user._id);

				return res.success(userWithRoles);
			} catch (e) {
				return res.failure(e.message);
			}
		},
	];
};
