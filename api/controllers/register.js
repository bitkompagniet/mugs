const rumor = require('rumor')();
const _ = require('lodash');
const mail = require('../../lib/mail');

module.exports = function(store, config) {
	return function(req, res) {
		return store.create(_.pick(req.body, ['email', 'fullname', 'password', 'data']))
			.then(user =>
				mail.confirmation(user, config)
					.then(() => res.success(user))
			)
			.catch(res.failure);
	};
};
