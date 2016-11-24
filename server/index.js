const rumor = require('rumor')();

module.exports = function(app, port = 3000) {
	return app.listen(port, () => rumor.debug('Server started.'));
};
