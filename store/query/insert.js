const passwordGenerator = require('password-generator');

module.exports = async function(body) {
	const existing = await this.find({ email: body.email });
	if (existing.length > 0) throw new Error('E-mail already in use.');
	body.password = (body.password) ? body.password : passwordGenerator(8);
	const user = await this.create(body);
	await this.configureDefaultRoles(user._id);
	await this.confirmRegistration(user.confirmationToken);
	const newUser = await this.get(user._id);
	newUser.password = body.password;
	return newUser;
};
