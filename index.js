const api = require('./api')
const debug = require('debug')('http');
const createStore = require('./store');

debug('Server started.');

const store = createStore('localhost:27017');
api(store);
