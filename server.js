#!/usr/bin/env node

const api = require('./api');
const debug = require('debug')('http');
const createStore = require('./store');
const server = require('./server');

const { db } = process.env;

if (!db) throw new Error('Please supply a db env variable.');

debug('Server started.');
const store = createStore(db);
server(api(store));
