const sendEmail = require('./sendEmail');

module.exports = {
	recover: (smtp, resetPasswordToken, appName, passwordRecoveryUrl, logoLink, user) => {
		const templatePath = '/email_templates/recoverpass.hbs';

		const emailData = {
			resetPasswordLink: `${passwordRecoveryUrl}/${resetPasswordToken}`,
			appName,
			logoLink,
			user,
		};

		return sendEmail(smtp, templatePath, emailData);
	},

	// smtp, confirmRegistrationUrl, appName, logoLink, user
	confirmation: (smtp, confirmRegistrationUrl, appName, logoLink, user) => {
		const templatePath = '/email_templates/confirmation.hbs';

		const emailData = {
			confirmRegistrationUrl,
			appName,
			logoLink,
			user,
		};

		return sendEmail(smtp, templatePath, emailData);
	},

	sendPassword: (smtp, password, appName, appUrl, logoLink, user) => {
		const templatePath = '/email_templates/sendPassword.hbs';
		const emailData = {
			appName,
			logoLink,
			password,
			appUrl,
			user,
		};
		return sendEmail(smtp, templatePath, emailData);
	},
};

