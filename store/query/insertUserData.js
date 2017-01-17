module.exports = async function(id, data) {
	const user = await this.findById(id);
	user.data = data;

	const err = user.validateSync();
	if (err) throw new Error(err);

	const result = await user.save();
	return result.toJSON();
};
