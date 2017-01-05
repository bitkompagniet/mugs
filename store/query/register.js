module.exports = function(user) {
	return this
		.insert(user)
		.then(created => ({ _id: created._id, email: created.email, confirmationToken: created.confirmationToken }));
};
