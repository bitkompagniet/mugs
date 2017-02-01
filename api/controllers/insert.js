const allowedBodyProperties = require('../middleware/allowedBodyProperties');
const ensureFirstLastname = require('../middleware/ensureFirstLastname');
const requireUserAdmin = require('../middleware/requireUserAdmin');
const validateBodyRoleAssignments = require('../middleware/validateBodyRoleAssignments');

module.exports = function(store) {
	return [
		requireUserAdmin(),
		ensureFirstLastname(),
		validateBodyRoleAssignments(),
		allowedBodyProperties(['email', 'firstname', 'lastname', 'password', 'data', 'roles']),

		async function(req, res) {
			try {
				const user = await store.insert(req.allowedBody);
				await store.configureDefaultRoles(user._id);
				const userWithRoles = await store.get(user._id);

				return res.success(userWithRoles);
			} catch (e) {
				return res.failure(e.message);
			}
		},
	];
};
