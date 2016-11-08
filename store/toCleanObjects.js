module.exports = function toCleanObjects(result) {
	if (result == null) return null;
	return (Array.isArray(result)) ? result.map(o => o.toObject()) : result.toObject();
}
