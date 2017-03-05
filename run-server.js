#!/usr/bin/env node

const getConfig = require('./get-config');
const api = require('./api');
const createStore = require('./store');
const server = require('./server');
const rumor = require('rumor')('Mugs');

const config = getConfig(process.env);

if (!config.smtp) {
	rumor.warn('SMTP ENV var not set, all e-mails will be DISABLED for this session.');
}

const store = createStore(config.db);
server(api(store, config), config.port);
