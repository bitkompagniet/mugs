const mongoose = require('mongoose');
module.exports = function (models) {
	return mongoose.connection.db.dropDatabase();
}
