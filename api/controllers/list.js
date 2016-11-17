module.exports = function(store) {
	return function(req, res) {
		const roles = req.identity.user.roles;
		const canViewGroups = roles
			.map(role => role.split(':'))
			.filter(([subrole, group]) => subrole.includes(['admin', 'member']) && Boolean(group))
			.map(([subrole, group]) => group); // eslint-disable-line no-unused-vars

		if (canViewGroups.length === 0) return res.failure('don\'t have access to view any groups');

		return store.list({ groups: canViewGroups })
			.then(res.success)
			.catch(res.failure);
	};
};
