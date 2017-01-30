module.exports = async function (_id, role, scope) {
	await this.findOneAndUpdate({ _id }, {
		$pull: { roles: { role, scope } },
	});
	const user = await this.findById(_id);
	return user;
};
