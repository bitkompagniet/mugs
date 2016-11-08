const api = require('./api');
const debug = require('debug')('http');
const createStore = require('./store');
const server = require('./server');

module.exports = function(db){

	if (!db) throw new Error('Please supply a db env variable.');
	const store = createStore(db);
	return api(store);
}