const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verify = require('../controllers/verify');
const me = require('../controllers/me');
const list = require('../controllers/list');
const confirmRegister = require('../controllers/confirm-register');
const get = require('../controllers/get');
const create = require('../controllers/create');
const insertUserData = require('../controllers/insertUserData');
const getUserData = require('../controllers/getUserData');


module.exports = function createRouter(store) {
	const router = express.Router();

	// CRUD
	router.get('/', list(store));
	router.get('/:id', get(store));
	router.post('/', create(store));

	// Me
	router.get('/me', me(store));

	// Registration
	router.post('/register', register(store));
	router.get('/register/:token', confirmRegister(store));

	// Login
	router.post('/login', login(store));

	// Password recovery
	router.get('/verify/:token', verify());

	// User data
	router.get('/:id/data', getUserData(store));
	router.post('/:id/data', insertUserData(store));

	return router;
};
