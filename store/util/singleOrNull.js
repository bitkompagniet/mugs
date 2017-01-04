module.exports = function singleOrNull(result) {
	return (result && result.length && result.length === 1 && result[0]) || null;
};
