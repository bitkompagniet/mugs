const express = require('express');
const respondo = require('respondo');
const configuration = require('./middleware/configuration');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mercutio = require('mercutio');

module.exports = function (store, config) {
	const app = express();

	app.use(respondo.responders());
	app.use(bodyParser.json());
	app.use(configuration(config));
	app.use(respondo.authorizationIdentity(config.secret));
	app.use(mercutio.middleware());
	app.use(routes(store, config));
	app.use(respondo.errors(false));

	return app;
};
