const requireRole = require('./require-role');

module.exports = function() {
	return requireRole('admin@users');
};
