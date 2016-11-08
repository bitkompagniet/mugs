const express = require('express');

module.exports = function createRouter(store) {
	const router = express.Router();
	router.get('/', (req, res) =>
		store.list()
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	router.get('/:id', (req, res) =>
		store.get(req.params.id)
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	router.post('/', (req, res) =>
		store.create({ name: 'nikolaj', password: 'yo' })
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	router.delete('/users', (req, res) =>
		store.reset()
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);

	router.delete('/:id', (req, res) =>
		store.delete(req.params.id)
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);

	router.put('/', (req, res) =>
		store.modify(req.body)
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);

	router.post('/login', (req, res) =>
		store.login()
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);
	return router;
};
