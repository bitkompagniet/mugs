module.exports = async function(confirmationToken) {
	const userWithToken = await this.findOne({ confirmationToken });

	if (userWithToken) {
		return await this.findOneAndUpdate({ _id: userWithToken._id }, {
			$set: {
				confirmationToken: null,
				confirmed: new Date(),
			},
		}, { new: true });
	}

	throw new Error('The user with the supplied confirmation token did not exist.');
};
