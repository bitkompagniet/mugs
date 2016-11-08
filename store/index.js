const mongoose = require('mongoose');
const createModels = require('./createModels');

const getUser = require('./query/getUser');
const listUsers = require('./query/list');
const createUser = require('./query/createUser');
const deleteUser = require('./query/deleteUser');
const resetDB = require('./query/resetDB');
const addRole = require('./query/addRole');

module.exports = function (uri) {
	if (!uri) throw new Error('db uri required.');

	mongoose.connect(uri);
	const models = createModels(uri);

	const store = {};
	store.create = data => createUser(data, models);
	store.list = query => listUsers(query, models);
	store.delete = id => deleteUser(id, models);
	store.get = id => getUser(id, models);
	store.addRole = (id, role) => addRole(id, role, models);
	store.reset = () => resetDB();
	return store;
};
