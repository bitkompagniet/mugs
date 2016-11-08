const mongoose = require('mongoose');

module.exports = function () {
	return mongoose.connection.db.dropDatabase();
};
