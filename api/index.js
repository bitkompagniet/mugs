const express = require('express');
const respondo = require('respondo');
const routes = require('./routes');
const bodyParser = require('body-parser');

module.exports = function (store) {
	const app = express();

	app.use(respondo.responders());
	app.use(bodyParser.json());
	app.use(routes(store));


	app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
		res.failure(err, 500)
	);

	app.use((req, res) =>
		res.failure('Not a valid path', 404)
	);

	return app;
};
