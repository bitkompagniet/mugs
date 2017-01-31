module.exports = async function(body) {
	const existing = await this.find({ email: body.email });
	if (existing.length > 0) throw new Error('E-mail already in use.');

	const user = await this.create(body);
	await this.configureDefaultRoles(user._id);
	await this.confirmRegistration(user.confirmationToken);

	return await this.get(user._id);
};
