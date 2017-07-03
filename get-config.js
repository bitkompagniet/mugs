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
		smtp: optional('smtp', source),
		senderEmail: optional('senderEmail', source),
		db: optional('db', source, 'mongodb://localhost:27017/mugs'),
		secret: optional('secret', source, 'ssh'),
		logoLink: optional('logoLink', source, 'http://placehold.it/550x150?size=38&text=[Company%20logo]'),
		appName: optional('appName', source, 'MUGS TEST INSTANCE'),
		appUrl: optional('appUrl', source, 'http://localhost:3000/'),
		redirectConfirmUrl: optional('redirectConfirmUrl', source, 'http://localhost:3000/redirect'),
		port: optional('port', 3000),
		passwordRecoveryUrl: optional('passwordRecoveryUrl', source, 'http://localhost:3000/passwordrecovery'),
	};

	return config;
};
