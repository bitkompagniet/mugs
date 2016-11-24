const express = require('express');
const respondo = require('respondo');
const permissionMatrix = require('./middleware/permissionMatrix');
const routes = require('./routes');
const bodyParser = require('body-parser');

module.exports = function (store, config) {
	const app = express();

	app.use(bodyParser.json());
	app.use(respondo.responders());
	app.use(respondo.authorizationIdentity(config.secret));
	app.use(permissionMatrix());

	app.use(routes(store, config));
	app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
		res.failure(err, 500)
	);

	app.use(respondo.errors());

	return app;
};
