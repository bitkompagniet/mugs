module.exports = async function(id) {
	const user = await this.findById(id);
	await user.remove().exec();
	return null;
};
