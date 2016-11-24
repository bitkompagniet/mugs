const express = require('express');

module.exports = function createRouter(store, config) {
	const router = express.Router();

	router.post('/register', register(store, config));
	router.post('/login', login(store, secret));
	router.get('/verify/:token', verify(store, secret));
	router.get('/me', requireAuthentication(), me(store, secret));

	return router;
};
