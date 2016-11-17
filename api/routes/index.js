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

	// router.post('/register');
	// router.get('/register/:token');

	// router.post('/recover/:email');
	// router.get('/recover/:token');
	// router.get('/');
	// router.get('/:id');
	// router.post('/');
	// router.put('/');
	// router.delete('/:id');

	// router.get('/:id', (req, res) =>
	// 	store.get(req.params.id)
	// 	.then(result => res.success(result))
	// 	.catch(err => res.failure(err))
	// );

	// router.post('/', (req, res) =>
	// 	store.create({ name: 'nikolaj', password: 'yo' })
	// 	.then(result => res.success(result))
	// 	.catch(err => res.failure(err))
	// );

	// router.delete('/users', (req, res) =>
	// 	store.reset()
	// 	.then(result => res.success(result))
	// 	.catch(result => res.failure(result))
	// );

	// router.delete('/:id', (req, res) =>
	// 	store.delete(req.params.id)
	// 	.then(result => res.success(result))
	// 	.catch(result => res.failure(result))
	// );

	// router.put('/', (req, res) =>
	// 	store.modify(req.body)
	// 	.then(result => res.success(result))
	// 	.catch(result => res.failure(result))
	// );


	// router.get('/', (req, res) => res.send('Hello!'));
	router.post('/:id/data', (req, res) =>
		store.postData(req.body.id, req.body.data)
		.then(result => res.success(result))
		.catch(result => res.faliure(result))
	); 

	router.get('/:id/data', (req, res) =>
		store.getData(req.body.id, req.body.data)
		.then(result => res.success(result))
		.catch(result => res.faliure(result))
	);

	return router;
};
