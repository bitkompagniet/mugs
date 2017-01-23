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

	confirmation: (config) => {
		const templatePath = '/email_templates/confirmation.hbs';

		// console.log(config);

		const emailData = {
			email: config.email,
			confirmationLink: config.confirmRegistrationUrl,
			appName: config.appName,
			logoLink: config.logoLink,
		};

		return sendEmail(config.smtp, templatePath, emailData);
	},
};

