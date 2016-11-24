const rumor = require('rumor')();

module.exports = function(store) {
	return function(req, res) {
		return store.create(req.body)
			.then(res.success);
	};
};
