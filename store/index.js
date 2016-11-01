const mongoose = require('mongoose');
const createModels = require('./createModels');

//queries:
const list = require('./query/list');
const createUser = require('./query/createUser');

module.exports = function(uri){
	mongoose.connect(uri);

	const models = createModels(uri);
	const store = {};

	store.createUser = data => createUser(data, models);
	store.list = query => list(query, models);

	return store;
}