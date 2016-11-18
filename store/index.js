const mongoose = require('mongoose');
const createModels = require('./createModels');
const resetDB = require('./util/resetDB');

mongoose.Promise = Promise;

function formatError(err) {
	if (err.name && err.name === 'ValidationError') {
		const formatted = Object.keys(err.errors)
			.map(key => err.errors[key])
			.map(obj => ({ field: obj.path, type: obj.kind, message: obj.message }));

		return Promise.reject({ type: 'validation', errors: formatted });
	}

	return Promise.reject(err);
}

module.exports = function (uri) {
	const store = {};

	if (!uri) throw new Error('db uri required.');

	store.connection = mongoose.createConnection(uri);
	store.ready = new Promise((resolve) => { store.connection.once('connected', resolve); });

	const models = createModels(store.connection);

	store.create = data => models.users.create(data).then(user => user.toJSON()).catch(formatError);
	store.login = (email, password) => models.users.auth(email, password);
	store.list = query => models.users.list(query);
	store.delete = id => models.users.delete(id);
	store.get = id => models.users.get(id, models);

	store.getData = (id, data) => models.users.get(id, data);
	store.postData = (id, data) => models.users.post(id, data);
	
	store.addRole = (id, role, group) => models.users.addRole(id, role, group);
	store.removeRole = (id, role, group) => models.users.removeRole(id, role, group);
	store.reset = () => resetDB(store);
	store.modify = user => models.users.modify(user, models);
	store.confirm = (email, confirmationToken) => models.users.confirmRegistration(email, confirmationToken);
	store.requestRecoveryToken = email => models.users.requestRecoveryToken(email, models);

	return store;
};
