#!/usr/bin/env node

const api = require('./api');
const createStore = require('./store');
const server = require('./server');

function required(name) {
	if (process.env[name]) return process.env[name];
	throw new Error(`'${name}' env var required`);
}

const smtp = required('smtp');
const db = required('db');
const secret = required('secret');
const logoLink = required('logoLink');
const appName = required('appName');
const confirmationLink = required('confirmationLink');

const config = { smtp, db, secret, logoLink, appName, confirmationLink };

const store = createStore(db);
server(api(store, config));
