const express = require('express');
const requireAuthentication = require('../middleware/requireAuthentication');
const me = require('../controllers/me');
const list = require('../controllers/list');
const rumor = require('rumor')('mugs:routes');

module.exports = function createRouter(store) {
	const router = express.Router();

	router.get('/', (req, res) => res.success('yes'));

	// router.post('/register');
	// router.get('/register/:token');
	// router.get('/me', requireAuthentication(), me(store));
	// router.post('/recover/:email');
	// router.get('/recover/:token');
	// router.get('/');
	// router.get('/:id');
	// router.post('/');
	// router.put('/');
	// router.delete('/:id');

	router.get('/:id', (req, res) =>
		store.get(req.params.id)
		.then(result => res.success(result))
		.catch(err => res.failure(err))
	);

	router.post('/', (req, res) =>
		store.create({ name: 'nikolaj', password: 'yo' })
		.then(result => res.success(result))
		.catch(err => res.failure(err))
	);

	router.delete('/users', (req, res) =>
		store.reset()
		.then(result => res.success(result))
		.catch(result => res.failure(result))
	);

	router.delete('/:id', (req, res) =>
		store.delete(req.params.id)
		.then(result => res.success(result))
		.catch(result => res.failure(result))
	);

	router.put('/', (req, res) =>
		store.modify(req.body)
		.then(result => res.success(result))
		.catch(result => res.failure(result))
	);

	router.post('/login', (req, res) =>
		store.login()
		.then(result => res.success(result))
		.catch(result => res.failure(result))
	);
	return router;
};
