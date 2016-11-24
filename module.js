const api = require('./api');
const createStore = require('./store');
// const store = require('./st');

// const some = 27;

const defaultConfig = {
	confirmationLink: 'http://www.test.dk/',
	appName: 'mugs',
	logoLink: 'http://www.free-logotypes.com/logos/png/Win_95.png',
	smtp: 'smtps://system@bitkompagniet.dk:hattefar@smtp.gmail.com:465',
	db: 'db=localhost:27017',
	secret: 'sssshh',
};

module.exports = function(db, config = { defaultConfig }) {
	if (!db) throw new Error('Please supply a db env variable.');
	const store = createStore(db);
	return api(store, config);
};
