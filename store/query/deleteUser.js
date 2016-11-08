module.exports = function (id, models) {
	return models.users.findByIdAndRemove(id);
};
