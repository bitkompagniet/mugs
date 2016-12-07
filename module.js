const api = require('./api');
const createStore = require('./store');
const getConfig = require('./get-config');

module.exports = function(args) {
	const config = getConfig(args);
	const store = createStore(config.db);
	return api(store, config);
};
