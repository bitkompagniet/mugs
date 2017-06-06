const _ = require('lodash');

module.exports = function() {
	return function(req, res, next) {
		if (req.body.fullname) {
			if (req.body.firstname || req.body.lastname) {
				return res.failure('Either specify fullname or a firstname/lastname pair. Do not supply fullname in conjunction with any of the latter.', 422);
			}

			const split = req.body.fullname.split(' ').filter(i => _.isString(i) && !_.isEmpty(i));

			if (split.length <= 1) {
				return res.failure('When setting a fullname, more than one name is required.');
			}

			req.body.firstname = split.slice(0, -1).join(' ');
			req.body.lastname = split[split.length - 1];
			delete req.body.fullname;
		}

		return next();
	};
};
