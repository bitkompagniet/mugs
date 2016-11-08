const express = require('express');
const respondo = require('respondo');
const routes = require('../routes');

module.exports = function (store) {
	const app = express();

	app.use(respondo.responders());
	app.use(routes(store));

	return app;
};
