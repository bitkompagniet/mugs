const express = require('express');
const respondo = require('respondo');

module.exports = function(store) {

	const app = express();

	app.use(respondo.responders());

	app.get('/', (req, res) => 
		store.list()
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	app.get('/:id', (req, res) => 
		store.get(req.params.id)
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	app.post('/', (req, res) => 
		store.create({name: "nikolaj", password: "yo"})
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	app.delete('/users', (req, res) => 
		store.reset()
		.then(result => res.send(result))
		.catch(result => res.send(result))
	)

	app.delete('/:id', (req, res) => 
		store.delete(req.params.id)
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);

	app.put('/', (req, res) => 
		store.modify(req.body)
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);

	app.post('/login', (req, res) => 
		store.login()
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);


	return app;
}