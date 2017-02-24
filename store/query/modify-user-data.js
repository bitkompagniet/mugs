const _ = require('lodash');

module.exports = async function(id, data) {
	const user = await this.findById(id);
	user.data = _.merge({}, user.data, data);

	const err = user.validateSync();
	if (err) throw new Error(err);

	const result = await user.save();
	return result.toJSON();
};
