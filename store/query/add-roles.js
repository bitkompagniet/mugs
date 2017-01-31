const mercutio = require('mercutio');
const _ = require('lodash');

module.exports = async function (_id, roles) {
	const user = await this.findById(_id);
	_.each(roles, role => user.roles.push(role));
	user.roles = mercutio(user.roles).rationalize().toArray();
	await user.save();
	return user;
};
