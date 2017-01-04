const single = require('../util/single');

module.exports = function(resetPasswordToken) {
	return this.find({ resetPasswordToken }).then(single).then(res => res.toJSON());
};
