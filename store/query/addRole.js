module.exports = async function (_id, role, scope) {
	return await this.findOneAndUpdate({ _id }, {
		$addToSet: { roles: { role, scope } },
	});
};
