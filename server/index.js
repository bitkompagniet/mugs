const rumor = require('rumor')();

module.exports = function(app, port = 3000) {
	return app.listen(port, () => rumor.info(`Server started on http://localhost:${port}.`));
};
