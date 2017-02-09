const allowedBodyProperties = require('../middleware/allowed-body-properties');
const ensureFirstLastname = require('../middleware/ensure-first-last-name');
const requireUserAdmin = require('../middleware/require-user-admin');
const validateBodyRoleAssignments = require('../middleware/validate-body-role-assignments');
const mail = require('../../lib/mail');
const _ = require('lodash');

module.exports = function(store) {
	return [
		requireUserAdmin(),
		ensureFirstLastname(),
		validateBodyRoleAssignments(),
		allowedBodyProperties(['email', 'firstname', 'lastname', 'password', 'data', 'roles']),

		async function(req, res) {
			try {
				const user = await store.insert(req.allowedBody);
				const password = user.password;
				delete user.password;

				await store.configureDefaultRoles(user._id);
				const userWithRoles = await store.get(user._id);

				await mail.sendPassword(_.merge({}, user, req.configuration(), { password }));

				return res.success(userWithRoles);
			} catch (e) {
				return res.failure(e.message);
			}
		},
	];
};
