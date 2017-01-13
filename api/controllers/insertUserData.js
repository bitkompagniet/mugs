const requireAuthentication = require('../middleware/requireAuthentication');

module.exports = function(store) {
	return [requireAuthentication(),
		async function(req, res) {
			const id = req.params.id;
			const data = req.body.data;

			await store.insertUserData(id, data);
			return res.success();
		},
	];
};
