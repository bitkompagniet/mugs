const express = require('express');
const respondo = require('respondo');
const configuration = require('./middleware/configuration');
const permissionMatrix = require('./middleware/permissionMatrix');
const routes = require('./routes');
const bodyParser = require('body-parser');


module.exports = function (store, config) {
	const app = express();

	app.use(respondo.responders());
	app.use(bodyParser.json());
	app.use(configuration(config));
	app.use(respondo.authorizationIdentity(config.secret));
	app.use(permissionMatrix());
	app.use(routes(store));
	app.use(respondo.errors(false));

	return app;
};
