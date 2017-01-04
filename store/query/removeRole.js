module.exports = function (_id, role, scope) {
	return this.findOneAndUpdate({ _id }, {
		$pull: { roles: { role, scope } },
	});
};
