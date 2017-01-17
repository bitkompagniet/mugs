const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	const before = [requireAuthentication()];

	const controller = async function(req, res, next) {
		try {
			if (!req.identity.is(`member@users/${req.params.id}`)) return res.failure('');
			const user = await store.get(req.params.id);
			return res.success(user);
		} catch (e) {
			return next(e);
		}
	};

	return [...before, controller];
};
