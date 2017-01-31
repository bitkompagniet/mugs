const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const verify = require('../controllers/verify');
const me = require('../controllers/me');
const list = require('../controllers/list');
const confirmRegister = require('../controllers/confirm-register');
const get = require('../controllers/get');
const insert = require('../controllers/insert');
const modify = require('../controllers/modify');
const deleteUser = require('../controllers/delete');
const insertUserData = require('../controllers/insertUserData');
const getUserData = require('../controllers/getUserData');
const addRole = require('../controllers/addRole');


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

	// User data
	router.get('/:id/data', getUserData(store));
	router.post('/:id/data', insertUserData(store));

	// CRUD
	router.get('/', list(store));
	router.get('/:id', get(store));
	router.post('/', insert(store));
	router.put('/:id', modify(store));
	router.delete('/:id', deleteUser(store));

	// Roles
	router.post('/:id/roles', addRole(store));

	return router;
};
