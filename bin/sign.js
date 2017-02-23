const jsonwebtoken = require('jsonwebtoken');
const mercutio = require('mercutio');
const tokenExpiry = require('../lib/token-expiry');
const moment = require('moment');
const chalk = require('chalk');

const id = 'abcdef0123456789abcdef01';

function createModel(roles) {
	return {
		_id: id,
		email: 'test@mugs.info',
		firstname: 'Test',
		lastname: 'Testsen',
		roles,
	};
}

function createRoles(roles, suppressUserRoles = false) {
	try {
		let cRoles = [...roles];
		if (!suppressUserRoles) cRoles = [`admin@users/${id}`, `member@users/${id}`, ...cRoles];
		const roleArray = mercutio(cRoles).toArray();
		return roleArray;
	} catch (e) {
		console.log('Roles were not in a recognizable format. Please use [role]@[scope].');
		process.exit(1);
		return undefined;
	}
}

function createToken(model, secret) {
	const expiry = tokenExpiry({ days: 7 });
	console.log(chalk.yellow(`This token will expire at ${moment(expiry).format('DD-MM-YYYY HH:mm:ss')}`));
	return jsonwebtoken.sign(Object.assign(model, { exp: tokenExpiry({ days: 7 }) }), secret);
}

function write(message) {
	console.log(message); // eslint-disable-line
}

module.exports = function(roles, clean = false, admin = false, secret = 'ssh') {
	const roleStrings = admin ? ['*@/'] : roles;
	const formattedRoles = createRoles(roleStrings, clean || admin);
	const model = createModel(formattedRoles);

	write(`Signing a token for ${chalk.yellow(formattedRoles.map(i => `${i.role}@${i.scope}`).join(', '))} with secret ${chalk.gray(secret)}`);
	
	write('');
	write(model);
	write('');

	const token = createToken(model, secret);

	write('');
	write(chalk.green(token));
};
