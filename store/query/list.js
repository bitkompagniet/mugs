module.exports = function(query = {}) {
	let q = this;

	const filters = [];

	if (query.search) filters.push({ $text: { $search: query.search } });
	if (query.groups) filters.push({ groups: { $in: query.groups } });

	const filterExpression = { $and: filters };

	q = q.find((filters.length > 0 && filterExpression) || {});
	q = q.sort((query.sort && { [query.sort]: 'asc' }) || {});

	if (query.skip) {
		q = q.skip(query.skip);
	}

	if (query.limit) {
		q = q.limit(query.limit);
	}

	return q.then(res => res.map(o => o.toJSON()));
};
