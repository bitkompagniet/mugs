const express = require('express');
const requireAuthentication = require('../middleware/requireAuthentication');
const me = require('../controllers/me');
const list = require('../controllers/list');
const rumor = require('rumor')('mugs:routes');

module.exports = function createRouter(store) {
	const router = express.Router();

	router.get('/me', requireAuthentication(), me(store));
	router.get('/', (req, res, next) => {
		rumor.info(req.rights.can('editDetails', 'publishers', 'member@publishers'));
		return next();
	});

	// router.get('/', (req, res) => res.send('Hello!'));

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
