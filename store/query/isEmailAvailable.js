module.exports = function(email) {
	return this.getByEmail(email)
		.then(res => res === null);
};
