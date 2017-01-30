const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	const before = [requireAuthentication()];

	const controller = async function(req, res, next) {
		try {
			if (!req.identity.is(`member@users/${req.params.id}`)) return res.failure('');
			const user = await store.get(req.params.id);
			return res.success(user);
		} catch (e) {
			if (e.path === '_id' && e.name === 'CastError') {
				return res.failure('Invalid id', 400);
			}
			return res.failure(e);
		}
	};

	return [...before, controller];
};
