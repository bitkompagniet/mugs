const initialize = require('../initialize');

module.exports = async function (store) {
	await store.initialized;
	await store.connection.db.dropDatabase();
	await initialize(store);
	return;
};
