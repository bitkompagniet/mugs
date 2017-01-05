module.exports = function(store) {
	return async function(req, res) {
		const id = req.params.id;
		const data = req.body.data;

		await store.insertUserData(id, data);
		return res.succes();
	};
};
