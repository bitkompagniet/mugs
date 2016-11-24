const express = require('express');
const requireAuthentication = require('../middleware/requireAuthentication');
const me = require('../controllers/me');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verify = require('../controllers/verify');

module.exports = function createRouter(store, secret) {
	const router = express.Router();

	router.post('/register', register(store));
	router.post('/login', login(store, secret));
	router.get('/verify/:token', verify(store, secret));
	router.get('/me', requireAuthentication(), me(store, secret));

	return router;
};
