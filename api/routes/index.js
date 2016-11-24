const express = require('express');
const requireAuthentication = require('../middleware/requireAuthentication');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verify = require('../controllers/verify');
const me = require('../controllers/me');
const deleteAll = require('../controllers/deleteAll');
const recovery = require('../controllers/recovery');

module.exports = function createRouter(store, config) {
	const router = express.Router();

	router.post('/register', register(store, config));
	router.post('/login', login(store, config.secret));
	router.get('/verify/:token', verify(store, config.secret));
	router.get('/me', requireAuthentication(), me(store, config.secret));
	router.delete('/', deleteAll());
	router.get('recovery/:id', recovery(store));

	return router;
};
