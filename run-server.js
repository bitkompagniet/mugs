#!/usr/bin/env node

const getConfig = require('./get-config');
const api = require('./api');
const createStore = require('./store');
const server = require('./server');
const rumor = require('rumor')('Mugs');

const config = getConfig(process.env);

if (!config.smtp) {
	rumor.warn('SMTP has not been specified as ENV, e-mail sending will be supressed.');
}

const store = createStore(config.db);
server(api(store, config));
