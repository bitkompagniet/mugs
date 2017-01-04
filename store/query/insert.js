module.exports = async function(body) {
	const existing = await this.find({ email: body.email });
	if (existing.length > 0) throw new Error('E-mail already in use.');
	return (await this.create(body)).toJSON();
};
