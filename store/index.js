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

	store.register = data => models.users.register(data);
	store.insert = (data, roles) => models.users.insert(data, roles);
	store.login = (email, password) => models.users.auth(email, password);
	store.list = query => models.users.list(query);
	store.delete = id => models.users.delete(id);
	store.get = id => models.users.get(id);
	store.getByEmail = email => models.users.getByEmail(email);
	store.addRoles = (id, roles) => models.users.addRoles(id, roles);
	store.removeRoles = (id, roles) => models.users.removeRoles(id, roles);
	store.reset = () => resetDB(store);
	store.modify = (id, body) => models.users.modify(id, body);
	store.confirmRegistration = confirmationToken => models.users.confirmRegistration(confirmationToken);
	store.requestRecoveryToken = email => models.users.requestRecoveryToken(email, models);
	store.insertUserData = (id, data) => models.users.insertUserData(id, data, models);
	store.getUserData = id => models.users.getUserData(id);
	store.configureDefaultRoles = id => models.users.configureDefaultRoles(id);
	store.modifyUserData = (id, data) => models.users.modifyUserData(id, data);
	store.changePassword = (id, password, repeated, newPassword) => models.users.changePassword(id, password, repeated, newPassword);
	store.changePasswordWithRecovery = (email, recoveryToken, newPassword) => models.users.changePasswordWithRecovery(email, recoveryToken, newPassword);
	store.initialized = initialize(store);

	return store;
};
