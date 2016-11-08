module.exports = function (_id, role, models) {
	return models.findOneAndUpdate({ _id }, {
		$addToSet: { roles: role },
	});
};
