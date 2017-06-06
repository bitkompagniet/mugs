const _ = require('lodash');

module.exports = function(config) {
	return function(req, res, next) {
		const _config = _.merge({}, config);

		req.configuration = function(...args) {
			if (args.length === 0) return _.merge({}, _config);
			if (args.length > 1) _config[args[0]] = args[1];
			if (!(args[0] in _config)) throw new Error(`Invalid configuration key: ${args[0]}`);
			return _config[args[0]];
		};

		return next();
	};
};
