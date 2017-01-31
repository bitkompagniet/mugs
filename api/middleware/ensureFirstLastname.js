const _ = require('lodash');

module.exports = function() {
	return function(req, res, next) {
		if (req.body.fullname) {
			if (req.body.firstname || req.body.lastname) {
				return res.failure('Either specify fullname or a firstname/lastname pair. Do not supply fullname in conjunction with any of the latter.', 422);
			}

			const split = req.body.fullname.split(' ').filter(i => _.isString(i) && !_.isEmpty(i));
			const firstnameArray = split.slice(0, -1);

			req.body.firstname = '';
			firstnameArray.forEach(function(name) {
				req.body.firstname += `${name} `;
			});
			req.body.firstname = req.body.firstname.substring(0, req.body.firstname.length - 1);
			req.body.lastname = split.slice(-1);
			delete req.body.fullname;
		}

		return next();
	};
};
