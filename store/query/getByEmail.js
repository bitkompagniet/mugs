const singleOrNull = require('../util/singleOrNull');

module.exports = function(email) {
	return this.find({ email })
		.then(singleOrNull)
		.then(res => (res && res.toJSON()) || null);
};
