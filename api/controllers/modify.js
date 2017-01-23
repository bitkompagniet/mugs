const ensureFirstLastname = require('../middleware/ensureFirstLastname');

module.exports = function(store) {
	return [

		ensureFirstLastname(),

		async function(req, res) {
			const id = req.params.id;
			const body = req.body;

			if (!req.identity.is(`admin@users/${id}`)) return res.failure('You do not have permissions to modify this object.', 403);

			try {
				const result = await store.modify(req.params.id, body);
				return res.success(result);
			} catch (e) {
				return res.failure(e.message, 400);
			}
		},

	];
};
