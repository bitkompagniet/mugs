module.exports = async function(id) {
	const user = await this.findById(id);
	if (!user) {
		return await ('User not found');
	}
	return await this.findOneAndRemove({ _id: id }).then(null);
};
