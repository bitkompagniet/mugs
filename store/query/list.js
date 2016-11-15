module.exports = function(query = {}) {
	let q = this;

	q = q.find((query.search && { $text: { $search: query.search } }) || {});
	q = q.sort((query.sort && { [query.sort]: 'asc' }) || {});

	if (query.skip) {
		q = q.skip(query.skip);
	}

	if (query.limit) {
		q = q.limit(query.limit);
	}

	return q.then(res => res.map(o => o.toJSON()));
};
