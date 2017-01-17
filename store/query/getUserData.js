module.exports = async function(id) {
	const user = await this.findById(id);
	return await user.data;
};
