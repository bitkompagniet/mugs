const express = require('express');
const mail = require('../../lib/mail');

module.exports = function createRouter(store) {
	const router = express.Router();
	router.get('/', (req, res) =>
		store.list()
		.then(result => res.success(result))
		.catch(err => res.failure(err))
	);

	router.get('/:id', (req, res) =>
		store.get(req.params.id)
		.then(res.success)
		.catch(err => res.failure(err))
	);

	router.post('/', (req, res) =>
		store.create(req.body)
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

	router.post('/mail/:id', (req, res) =>
		store.get(req.params.id)
			.then(result => mail(result, process.env.smtp, '/email_templates/confirmation.hbs')
				.then(mailsucces => res.success(mailsucces))
				.catch(mailfailure => res.reject(mailfailure)))
			.catch(err => res.failure(err))
	);

	return router;
};
