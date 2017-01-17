const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [requireAuthentication(),
		async function(req, res) {
			if (!req.identity.is(`admin@users/${req.params.id}`)) return res.failure('');
			const id = req.params.id;
			const data = req.body.data;

			await store.insertUserData(id, data);
			return res.success();
		},
	];
};
