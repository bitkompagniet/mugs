const express = require('express');
const respondo = require('respondo');
const permissionMatrix = require('./middleware/permissionMatrix');
const routes = require('./routes');

module.exports = function (store, { secret }) {
	const app = express();

	app.use(respondo.responders());
	app.use(respondo.authorizationIdentity(secret));
	app.use(permissionMatrix());

	app.use(routes(store));

	return app;
};
