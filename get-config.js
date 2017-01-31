function required(name, source) {
	if (source[name]) return source[name];
	throw new Error(`'${name}' env var required`);
}

function optional(name, source, defaultValue) {
	if (source[name]) return source[name];
	return defaultValue;
}

module.exports = function(source) {
	const config = {
		smtp: required('smtp', source),
		db: optional('db', source, 'mongodb://localhost:27017/mugs'),
		secret: optional('secret', source, '868cd71ff515af8ab0ac0f6c312013ef7f8aa73aa5c75bfb767933ddff9d1e9e'),
		logoLink: optional('logoLink', source, 'http://placehold.it/550x150?size=38&text=[Company%20logo]'),
		appName: optional('appName', source, 'MUGS TEST INSTANCE'),
		appUrl: optional('appUrl', source, 'http://localhost:3000/'),
		redirectConfirmUrl: optional('redirectConfirmUrl', source, 'http://localhost:3000/redirect'),
	};

	return config;
};
