module.exports = async function(body) {
	const ignoreFields = ['_id', 'roles', 'password', 'confirmed', 'confirmationToken', 'resetPasswordToken'];

	const model = await this.findById(body._id);
	if (!model) throw new Error('id in payload does not match any existing entity.');

	const cleanBody = _.omit(body, ignoreFields);
	_.merge(model, cleanBody);

	const err = model.validateSync();
	if (err) throw new Error(err);

	const result = await model.save();
	return result.toJSON();
};
