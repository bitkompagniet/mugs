#!/usr/bin/env node

const getConfig = require('./get-config');
const api = require('./api');
const createStore = require('./store');
const server = require('./server');

const config = getConfig(process.env);

const store = createStore(config.db);
server(api(store, config));
