module.exports = async function(body) {
	const user = await this.create(body);
	await this.configureDefaultRoles(user._id);
	await this.confirmRegistration(user.confirmationToken);

	return await this.get(user._id);
};
