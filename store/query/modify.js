const _ = require('lodash');

module.exports = async function(id, body) {
	const ignoreFields = ['_id', 'roles', 'password', 'confirmed', 'confirmationToken', 'resetPasswordToken', 'data'];

	const model = await this.findById(id);
	if (!model) throw new Error('id in payload does not match any existing entity.');

	const cleanBody = _.omit(body, ignoreFields);
	_.merge(model, cleanBody);

	const err = model.validateSync();
	if (err) throw new Error(err);

	const result = await model.save();
	return result.toJSON();
};
