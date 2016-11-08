const express = require('express');
const payload = require('./payload');

module.exports = function(store) {

	const app = express();
	
	app.get('/list', (req, res) => 
		store.list()
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	app.get('/get/:id', (req, res) => 
		store.get(req.params.id)
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	app.post('/create', (req, res) => 
		store.create({name: "nikolaj", password: "yo"})
		.then(result => res.send(result))
		.catch(err => res.send(err))
	);

	app.delete('/delete/:id', (req, res) => 
		store.delete(req.params.id)
		.then(result => res.send(result))
		.catch(result => res.send(result))
	);

	app.put('/modify/', (req, res) => 
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