const passwordGenerator = require('password-generator');

module.exports = async function(body) {
	body.password = (body.password) ? body.password : passwordGenerator(8);
	const user = await this.create(body);
	await this.configureDefaultRoles(user._id);
	await this.confirmRegistration(user.confirmationToken);
	const newUser = await this.get(user._id);
	await this.addRoles(newUser.id, [{ role: body.role, scope: `users/${newUser.id}` }]);
	newUser.password = body.password;
	return newUser;
};
