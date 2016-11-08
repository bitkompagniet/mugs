const mongoose = require('mongoose');
const createModels = require('./createModels');

//queries:
const listUsers = require('./query/list');
const createUser = require('./query/createUser');
const deleteUser = require('./query/deleteUser');

module.exports = function(uri){
	
	mongoose.connect(uri);
	const models = createModels(uri);
	
	const store = {};
	store.create = data => createUser(data, models);
	store.list = query => listUsers(query, models);
	store.delete = id => deleteUser(id, models); 
	store.get = id => getUser(id, models); 
	store.modify = (id, body) => modifyUser
	return store;
}
