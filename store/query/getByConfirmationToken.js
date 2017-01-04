const single = require('../util/single');

module.exports = function(confirmationToken) {
	return this.find({ confirmationToken }).then(single).then(res => res.toJSON());
};
