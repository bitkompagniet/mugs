const api = require('./api');
const createStore = require('./store');
const getConfig = require('./get-config');
const rumor = require('rumor')('mugs');

module.exports = function(args) {
	const config = getConfig(args);
	if (!config.smtp) {
		rumor.warn('SMTP ENV var not set, all e-mails will be DISABLED for this session.');
	}
	const store = createStore(config.db);
	return api(store, config);
};
