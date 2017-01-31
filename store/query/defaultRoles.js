module.exports = function (id) {
	return Promise.all([
		this.addRole(id, 'admin', `users/${id}`),
		this.addRole(id, 'member', `users/${id}`),
	]);
};
