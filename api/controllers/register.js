const rumor = require('rumor')();
const _ = require('lodash');

module.exports = function(store) {
	return function(req, res) {
		return store.create(_.pick(req.body, ['email', 'fullname', 'password', 'data']))
			.then(res.success)
			.catch(res.failure);
	};
};
