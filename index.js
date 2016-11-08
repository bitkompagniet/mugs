const api = require('./api')
const debug = require('debug')('http');
const createStore = require('./store');
const server = require('./server');

debug('Server started.');
const store = createStore('localhost:27017');
server(api(store));


