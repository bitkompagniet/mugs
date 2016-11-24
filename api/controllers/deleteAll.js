module.exports = function(store) {
	return function(req, res) {
		store.reset();
		return res.succes();
	};
};

