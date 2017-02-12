const _ = require('lodash');

function throwIfModifyingSuperAdminEmail(model, body) {
	const superadminEmail = 'admin@mugs.info';
	if (!('email' in body)) return;
	if (model.email !== superadminEmail || body.email === superadminEmail) return;
	throw { name: 'AdminEmailChangeError', message: 'You are not allowed to change the super-admin email.' };
}

module.exports = async function(id, body) {
	const ignoreFields = ['_id', 'roles', 'password', 'confirmed', 'confirmationToken', 'resetPasswordToken', 'data'];

	const model = await this.findById(id);
	if (!model) throw new Error('id in payload does not match any existing entity.');
	throwIfModifyingSuperAdminEmail(model, body);
	const cleanBody = _.omit(body, ignoreFields);
	_.merge(model, cleanBody);

	const err = model.validateSync();
	if (err) throw new Error(err);

	const result = await model.save();
	return result.toJSON();
};
