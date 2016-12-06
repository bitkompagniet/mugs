const urlJoin = require('url-join');

module.exports = function(store) {
	return async function(req, res) {
		try {
			await store.confirmRegistration(req.params.token);
			return res.redirect(urlJoin(req.configuration('redirectConfirmUrl'), '?success=true'));
		} catch (e) {
			return res.failure(urlJoin(req.configuration('redirectConfirmUrl'), '?success=false&message=The confirmation token was invalid'));
		}
	};
};
