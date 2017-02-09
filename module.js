const api = require('./api');
const createStore = require('./store');
const getConfig = require('./get-config');
const rumor = require('rumor')('mugs');

module.exports = function(args) {
	const config = getConfig(args);
	if (!config.smtp) {
		rumor.warn('SMTP has not been set as ENV, e-mail sending will be supressed');
	}
	const store = createStore(config.db);
	return api(store, config);
};
