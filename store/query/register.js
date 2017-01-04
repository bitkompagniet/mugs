module.exports = function(user) {
	return this
		.create(user)
		.then(created => ({ _id: created._id, email: created.email, confirmationToken: created.confirmationToken }));
};
