const mongoose = require('mongoose');
const createModels = require('./createModels');
const resetDB = require('./util/resetDB');

mongoose.Promise = Promise;

module.exports = function (uri) {
	if (!uri) throw new Error('db uri required.');

	mongoose.connect(uri);
	const models = createModels(uri);

	const store = {};
	store.create = data => models.users.create(data).then(user => user.toJSON());
	store.list = query => models.users.list(query);
	store.delete = id => models.users.delete(id);
	store.get = id => models.users.get(id, models);
	store.getByEmail = id => models.users.getByEmail(id, models);
	store.addRole = (id, role) => models.users.addRole(id, role);
	store.removeRole = (id, role) => models.users.removeRole(id, role);
	store.reset = () => resetDB();
	store.modify = user => models.users.modify(user, models);
	store.confirm = (email, confirmationToken) => models.users.confirmRegistration(email, confirmationToken);
	store.requestRecoveryToken = email => models.users.requestRecoveryToken(email, models);

	return store;
};
