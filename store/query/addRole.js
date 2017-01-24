module.exports = function (_id, role, scope) {
	return this.findOneAndUpdate({ _id }, {
		$addToSet: { roles: { role, scope } },
	});
};
