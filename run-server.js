#!/usr/bin/env node

const api = require('./api');
const createStore = require('./store');
const server = require('./server');

function required(name) {
	if (process.env[name]) return process.env[name];
	throw new Error(`'${name}' env var required`);
}

const db = required('db');
const secret = required('secret');

const store = createStore(db);
server(api(store, { secret }));
