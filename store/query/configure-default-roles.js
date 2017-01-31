module.exports = function (id) {
	return this.addRoles(id, [
		{ role: 'admin', scope: `users/${id}` },
		{ role: 'member', scope: `users/${id}` },
	]);
};
