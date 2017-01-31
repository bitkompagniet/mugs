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

async function ensureUser(store, { email, password, firstname, lastname }) {
	const existing = await store.getByEmail(email);

	if (existing) {
		rumor.debug(`${email} was already a user.`);
		return false;
	}

	await store.insert({
		email,
		password,
		firstname,
		lastname,
	});

	rumor.info(`Created ${email} user.`);

	return true;
}

module.exports = async function(store) {
	return await Promise.all(
		users.map(user => ensureUser(store, user))
	);
};
