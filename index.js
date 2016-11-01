const createStore = require('./store');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	store = createStore('localhost:27017');
	store.createUser({name: "nikolaj", password: "yo"}).then(callback => console.log(callback)).catch(err => console.log(err));
	res.send('hest');
})
app.listen(3000);
