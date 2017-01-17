const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [requireAuthentication(),
		async function(req, res) {
			try {
				if (!req.identity.is('member@users/' + req.params.id)) return res.failure('Not allowed');
				const data = await store.getUserData(req.params.id);
				return res.success(data);
			} catch (e) {
				return res.failure('');
			}
		},
	];
};
