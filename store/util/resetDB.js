const mongoose = require('mongoose');

function retryDestroy() {
	return new Promise((resolve) => {
		let interval = null;

		interval = setInterval(() => {
			try {
				mongoose.connection.db.dropDatabase();
				clearInterval(interval);
				resolve();
			} catch (e) {
				// Do nothing, we wait till next time.
			}
		}, 50);
	});
}

module.exports = function () {
	return retryDestroy();
};
