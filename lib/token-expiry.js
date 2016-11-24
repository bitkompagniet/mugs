const moment = require('moment');

const standardExpiry = { hours: 2 };

module.exports = function(duration = standardExpiry) {
	return moment().add(duration).valueOf();
};
