const api = require('./api')
const debug = require('debug')('http');

debug('Server started.');
api('localhost:27017');
