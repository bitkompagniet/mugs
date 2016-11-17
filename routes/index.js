const express = require('express');

module.exports = function createRouter(store) {
	const router = express.Router();
	router.get('/', (req, res) =>
		store.list()
		.then(result => res.success(result))
		.catch(err => res.failure(err))
	);

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

	//TODO: Run test of store object
	// TAKE ON API REQUEST--------------------------------------------
	
	router.post('/:id/data', (req, res) =>
		store.postData(req.body.id, req.body.data) //.data
		.then(result => res.success(result))
		.catch(result => res.faliure(result))
	); 

	router.get('/:id/data', (req, res) =>
		store.getData(req.body.id, req.body.data) //.data
		.then(result => res.success(result))
		.catch(result => res.faliure(result))
	); 

	// -------------------------------------------------------------
	return router;
};
