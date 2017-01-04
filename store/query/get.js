module.exports = function(id) {
	return this.findById(id).then(res => res.toJSON());
};
