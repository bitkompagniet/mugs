module.exports = function (id, models) {
	return models.users.findById(id);
};
