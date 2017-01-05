const mongoose = require('mongoose');
const createModels = require('./createModels');
const resetDB = require('./util/resetDB');
// const rumor = require('rumor')('mugs:store');
const initialize = require('./initialize');

mongoose.Promise = Promise;

module.exports = function (uri) {
	const store = {};

	if (!uri) throw new Error('db uri required.');

	store.connection = mongoose.createConnection(uri);
	store.ready = new Promise((resolve) => { store.connection.once('connected', resolve); });

	const models = createModels(store.connection);

	store.insert = data => models.users.insert(data);
	store.login = (email, password) => models.users.auth(email, password);
	store.list = query => models.users.list(query);
	store.delete = id => models.users.delete(id);
	store.get = id => models.users.get(id, models);
	store.getByEmail = email => models.users.getByEmail(email, models);
	store.getRaw = id => models.users.getRaw(id);
	store.addRole = (id, role, group) => models.users.addRole(id, role, group);
	store.removeRole = (id, role, group) => models.users.removeRole(id, role, group);
	store.reset = () => resetDB(store);
	store.modify = user => models.users.modify(user, models);
	store.confirmRegistration = confirmationToken => models.users.confirmRegistration(confirmationToken);
	store.requestRecoveryToken = email => models.users.requestRecoveryToken(email, models);

	initialize(store);

	return store;
};
