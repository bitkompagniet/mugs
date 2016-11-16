const express = require('express');
const respondo = require('respondo');
const routes = require('./routes');

module.exports = function (store, { secret }) {
	const app = express();

	app.use(respondo.responders());
	app.use(respondo.authorizationIdentity(secret));
	app.use(routes(store));

	app.use(respondo.errors());

	return app;
};
