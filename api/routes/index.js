const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verify = require('../controllers/verify');
const me = require('../controllers/me');
const list = require('../controllers/list');
const confirmRegister = require('../controllers/confirm-register');
const get = require('../controllers/get');
const create = require('../controllers/create');
const modify = require('../controllers/modify');

module.exports = function createRouter(store, config) {
	const router = express.Router();

	// Me
	router.get('/me', me(store, config.secret));

	// Registration
	router.post('/register', register(store));
	router.get('/register/:token', confirmRegister(store));

	// Login
	router.post('/login', login(store));

	// Password recovery
	router.get('/verify/:token', verify());

	// CRUD
	router.get('/', list(store));
	router.get('/:id', get(store));
	router.post('/', create(store));
	router.put('/', modify(store));

	return router;
};
