const _ = require('lodash');

module.exports = function(allowedProperties) {
	return function(req, res, next) {
		req.allowedBody = _.pick(req.body, allowedProperties);
		return next();
	};
};
