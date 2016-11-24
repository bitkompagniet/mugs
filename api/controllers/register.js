const rumor = require('rumor')();
const _ = require('lodash');
const mail = require('../../lib/mail');

module.exports = function(store, config) {
	return function(req, res) {
		return store.create(_.pick(req.body, ['email', 'fullname', 'password', 'data']))
		.then(user =>
			store.getRaw(user.id).then(rawUser =>
				mail.confirmation(user, config, rawUser.confirmationToken)
				.then(() => res.success(user))
			)
		).catch(res.failure);
	};
};
