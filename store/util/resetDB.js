module.exports = function (store) {
	return store.ready.then(() => store.connection.db.dropDatabase());
};
