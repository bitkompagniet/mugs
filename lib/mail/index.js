const sendEmail = require('./sendEmail');

module.exports = {
	recover: (config, resetPasswordToken) => {
		const templatePath = '/email_templates/recoverpass.hbs';

		const emailData = {
			email: config.email,
			confirmationLink: config.appUrl + resetPasswordToken,
			appName: config.appName,
			logoLink: config.logoLink,
		};

		return sendEmail(config.smtp, templatePath, emailData);
	},

	// smtp, confirmRegistrationUrl, appName, logoLink, user
	confirmation: (config) => {
		const templatePath = '/email_templates/confirmation.hbs';

		const emailData = {
			email: config.email,
			confirmationLink: config.confirmRegistrationUrl,
			appName: config.appName,
			logoLink: config.logoLink,
		};

		return sendEmail(config.smtp, templatePath, emailData);
	},

	sendPassword: (config) => {
		const templatePath = '/email_templates/sendPassword.hbs';
		const emailData = {
			email: config.email,
			confirmationLink: config.confirmRegistrationUrl,
			appName: config.appName,
			logoLink: config.logoLink,
			password: config.password,
			appUrl: config.appUrl,
		};
		return sendEmail(config.smtp, templatePath, emailData);
	},
};

