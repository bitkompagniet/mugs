const express = require('express');
const requireAuthentication = require('../middleware/requireAuthentication');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verify = require('../controllers/verify');
const me = require('../controllers/me');
const deleteAll = require('../controllers/deleteAll');
const recovery = require('../controllers/recovery');
const confirmRegister = require('../controllers/confirm-register');

module.exports = function createRouter(store) {
	const router = express.Router();

	router.post('/register', register(store));
	router.get('/register/:token', confirmRegister(store));
	router.post('/login', login(store));
	router.get('/verify/:token', verify());
	router.get('/me', requireAuthentication(), me(store));
	router.delete('/', deleteAll());
	router.get('recovery/:id', recovery(store));

	return router;
};
