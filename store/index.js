const mongoose = require('mongoose');
const createModels = require('./createModels');

module.exports = function(uri){
	
	mongoose.connect(uri);

	const store = {};
	const models = createModels(uri);
	
	store.createUser = data => models.users.create(data) 
	store.list = query => list(query, models);

	return store;
}