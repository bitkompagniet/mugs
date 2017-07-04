const _ = require('lodash');
const mercutio = require('mercutio');

function inQuery(inObject = {}) {
	const result = {};

	_.each(inObject, (value, key) => {
		result[key] = _.isArray(value) ? { $in: value } : value;
	});

	return result;
}

function matchQuery(matchObject = {}) {
	return _.mapValues(matchObject,
		value => new RegExp(
			`^${value}$`
			.replace(/\./g, '\\.')
			.replace(/\?/g, '.')
			.replace(/\*/g, '.*')
		, 'i')
	);
}

function lteQuery(lteObject = {}) {
	return _.mapValues(lteObject, value => ({ $lte: value }));
}

function gteQuery(gteObject = {}) {
	return _.mapValues(gteObject, value => ({ $gte: value }));
}

function roleQuery(requestingUserRoles, roleQuery) {
	if (!requestingUserRoles) return {};
	const m = mercutio(requestingUserRoles);


	if (m.is('member@/')) return {};

	const scopeQuery = m
		.rationalize()
		.toArray()
		.filter(role => ['*', 'member'].includes(role.role))
		.map(role => ({ scope: new RegExp(`^${role.scope}`, 'i') }));


	const publicQuery = [{ scope: 'public' }];
	const fullOrQuery = publicQuery.concat(scopeQuery);
	let query;
	if (rolesQuery) {
		query = { roles: { $elemMatch: { $or: fullOrQuery } } };
	} else {
		query = {
			roles: {
				$elemMatch: {
					$and: [
						{
							role: roleQuery,
							scope: '',
						},
						{
							$or: fullOrQuery,
						}
					]


					},
				},
			},
		};
	}

	return query;
}

function findQuery(query) {
	return _.merge(
		{},
		matchQuery(query.match),
		inQuery(query.in),
		lteQuery(query.lte),
		gteQuery(query.gte),
		roleQuery(query.roles)
	);
}

function sortQuery(query) {
	return (_.isArray(query.sort) ? query.sort : [query.sort]).join(' ');
}

function skipQuery(query) {
	return query.skip ? parseInt(query.skip, 10) : 0;
}

function limitQuery(query) {
	return query.limit ? parseInt(query.limit, 10) : 0;
}

module.exports = function(query = {}) {
	const q = this.find(findQuery(query));

	if ('sort' in query) q.sort(sortQuery(query));
	if ('limit' in query) q.limit(limitQuery(query));
	if ('skip' in query) q.skip(skipQuery(query));

	return q;
};
