const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const rumor = require('rumor')('lib:sendMail');

module.exports = function(smtp, templatePath, emailData) {
	if (!smtp) return rumor.warn('No smtp specified, ignoring mail.');

	rumor.debug(`smtp: ${smtp}`);
	rumor.debug(`templatePath: ${templatePath}`);

	return new Promise(function(resolve, reject) {
		fs.readFile(path.join(__dirname, templatePath), 'utf8', function(err, fileContents) { // eslint-disable-line 
			if (err) {
				return reject(err);
			}

			const template = handlebars.compile(fileContents);
			const transporter = nodemailer.createTransport(smtp);

			const from = 'admin@mugs.info';
			const mailConfiguration = {
				from: `"${emailData.appName}" <${from}>`, // sender address
				to: emailData.user.email, // list of receivers
				subject: 'Confirmation from mugs', // Subject line
				text: '', // plaintext body
				html: template(emailData),
			};

			transporter.sendMail(mailConfiguration, function(error, info) {
				if (error) {
					return reject(error);
				}
				return resolve(info);
			});
		});
	});
};
