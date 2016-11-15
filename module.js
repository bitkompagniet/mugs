const api = require('./api');
const createStore = require('./store');
const store = require('./st');
const some = 27;

module.exports = function(db){
	if (!db) throw new Error('Please supply a db env variable.');
	const store = createStore(db);
	return api(store);
}