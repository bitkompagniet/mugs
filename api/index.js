const express = require('express');
const respondo = require('respondo');
const permissionMatrix = require('./middleware/permissionMatrix');
const routes = require('./routes');
const bodyParser = require('body-parser');

module.exports = function (store, { secret }) {
	const app = express();

	app.use(bodyParser.json());
	app.use(respondo.responders());
	app.use(respondo.authorizationIdentity(secret));
	app.use(permissionMatrix());

	app.use(routes(store, secret));

	return app;
};
