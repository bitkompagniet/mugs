function required(name, source) {
	if (source[name]) return source[name];
	throw new Error(`'${name}' env var required`);
}

module.exports = function(source) {
	const config = {
		smtp: required('smtp', source),
		db: required('db', source),
		secret: required('secret', source),
		logoLink: required('logoLink', source),
		appName: required('appName', source),
		appUrl: required('appUrl', source),
		redirectConfirmUrl: required('redirectConfirmUrl', source),
	};

	return config;
};
