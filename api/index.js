const express = require('express');
const app = express();
const createStore = require('../store');

module.exports = function(uri) {
	
	const store = createStore(uri);

	app.get('/create', (req, res) => {
		store.createUser({name: "nikolaj", password: "yo"})
		.then(result => {
			res.send(result);
		})
		.catch(err => {
			res.send(err);
		});
	});

	app.get('/list:', (req, res) => {
		store.list()
		.then(result => {
			res.send(result);
		})
		.catch(err => {
			res.send(err);
		});
	})

	app.listen(3000); 
}