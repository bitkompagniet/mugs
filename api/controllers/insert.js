const allowedBodyProperties = require('../middleware/allowed-body-properties');
const ensureFirstLastname = require('../middleware/ensure-first-last-name');
const requireUserAdmin = require('../middleware/require-user-admin');
const validateBodyRoleAssignments = require('../middleware/validate-body-role-assignments');

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
				if (e.name === 'MongoError' && e.code === 11000) {
					return res.failure('User already exists.', 409);
				}
				return res.failure(e.message);
			}
		},
	];
};
