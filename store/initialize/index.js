const rumor = require('rumor')('mugs:initialize');

const users = [
	{
		email: 'admin@mugs.info',
		password: 'admin',
		fullname: 'Admin at mugs',
		roles: [
			{ role: '*', scope: '/' },
		],
	},
	{
		email: 'ladmin@mugs.info',
		password: 'admin',
		fullname: 'Lesser admin at mugs',
		roles: [
			{ role: 'admin', scope: 'sites' },
		],
	},
	{
		email: 'member@mugs.info',
		password: 'member',
		fullname: 'Lesser admin at mugs',
		roles: [
			{ role: 'member', scope: 'sites/27' },
			{ role: 'member', scope: 'users/27' },
		],
	},
];

async function ensureUser(store, { email, password, fullname, roles }) {
	const existing = await store.getByEmail(email);

	if (existing) {
		rumor.debug(`${email} already existed in the users.`);
		return false;
	}

	const result = await store.create({
		email,
		password,
		fullname,
	});

	const id = result._id;

	await Promise.all(
		roles
			.map(role => store.addRole(id, role.role, role.scope))
			.concat([
				store.addRole(id, 'admin', `users/${result._id}`),
				store.addRole(id, 'member', `users/${result._id}`),
			])
	);

	const rawUser = await store.getRaw(id);
	const confirmationToken = rawUser.confirmationToken;

	await store.confirmRegistration(confirmationToken);

	rumor.info(`Created ${email} user.`);

	return true;
}

module.exports = async function(store) {
	return await Promise.all(
		users.map(user => ensureUser(store, user))
	);
};
