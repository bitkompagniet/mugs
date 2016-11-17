const mongoose = require('mongoose');
const createModels = require('./createModels');
const resetDB = require('./util/resetDB');

mongoose.Promise = Promise;
// let store = null;

module.exports = function (uri) {
	// if (store) return store;

	const store = {};

	if (!uri) throw new Error('db uri required.');

	store.connection = mongoose.createConnection(uri);
	store.ready = new Promise((resolve) => { store.connection.once('connected', resolve); });

	const models = createModels(store.connection);

	store.create = data => models.users.create(data).then(user => user.toJSON());
	store.list = query => models.users.list(query);
	store.delete = id => models.users.delete(id);
	store.get = id => models.users.get(id, models);
	store.addRole = (id, role) => models.users.addRole(id, role);
	store.removeRole = (id, role) => models.users.removeRole(id, role);
	store.reset = () => resetDB(store);
	store.modify = user => models.users.modify(user, models);
	store.confirm = (email, confirmationToken) => models.users.confirmRegistration(email, confirmationToken);
	store.requestRecoveryToken = email => models.users.requestRecoveryToken(email, models);

	return store;
};
