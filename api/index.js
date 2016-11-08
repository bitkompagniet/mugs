const express = require('express');
const respondo = require('respondo');
const routes = require('../routes');

module.exports = function (store) {
	const app = express();

	app.use(respondo.responders());
	app.use(routes(store));

	app.use('/*', (err, req, res, next) => // next has to be an argument for the error handling to work??
		res.failure(err, 500)
	);

	app.use('/*', (req, res) =>
		res.failure('Not a valid path', 404)
	);

	return app;
};
