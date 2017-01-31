module.exports = async function(user) {
	const rawUser = await this.create(user);
	await this.defaultRoles(rawUser._id);
	const result = await this.get(rawUser._id);

	return {
		user: result,
		confirmationToken: rawUser.confirmationToken,
	};
};
