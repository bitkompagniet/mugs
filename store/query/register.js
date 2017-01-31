module.exports = async function(user) {
	const rawUser = await this.create(user);
	await this.configureDefaultRoles(rawUser._id);
	const result = await this.get(rawUser._id);

	return {
		user: result,
		confirmationToken: rawUser.confirmationToken,
	};
};
