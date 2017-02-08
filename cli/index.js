const jsonwebtoken = require('jsonwebtoken');
const mercutio = require('mercutio');
const minimist = require('minimist');
const tokenExpiry = require('../lib/token-expiry');
const moment = require('moment');
const chalk = require('chalk');

function createModel(roles) {
	return {
		email: 'test@mugs.info',
		firstname: 'Test',
		lastname: 'Testsen',
		roles,
	};
}

function createRoles(roles) {
	try {
		const roleArray = mercutio(roles).toArray();
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

const args = minimist(process.argv.slice(2));
const secret = args.secret || 'ssh';
const roles = createRoles(args._);
const model = createModel(roles);

write(`Signing a token for ${chalk.yellow(roles.map(i => `${i.role}@${i.scope}`).join(', '))} with secret ${chalk.gray(secret)}:`);

const token = createToken(model, secret);
write('');
write(chalk.green(token));
