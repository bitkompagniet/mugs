const rumor = require('rumor')('mugs:initialize');

const users = [
	{
		email: 'admin@mugs.info',
		password: 'admin',
		firstname: 'Admin',
		lastname: 'Adminson',
		roles: [
			{ role: '*', scope: '/' },
		],
	},
];

async function ensureUser(store, { email, password, firstname, lastname, roles }) {
	const existing = await store.getByEmail(email);

	if (existing) {
		rumor.debug(`${email} was already a user.`);
		return false;
	}

	const result = await store.create({
		email,
		password,
		firstname,
		lastname,
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
