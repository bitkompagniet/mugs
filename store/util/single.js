module.exports = function single(result) {
	if (result && result.length && result.length === 1) {
		return result[0];
	}

	throw new Error('Single element required, but object had unexpected length or was not an array.');
};
