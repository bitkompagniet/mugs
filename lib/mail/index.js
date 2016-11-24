const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


function mailController (user, smtp, templatePath, emailData) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path.join(__dirname, templatePath), 'utf8', function(err, data) { // eslint-disable-line 
			if (err) {
				return reject(err);
			}

			if (user.confirmed != null) {
				return reject(new Error('User already confirmed'));
			}

			const source = data;
			const template = handlebars.compile(source);

			// console.log(template(user));

			const transporter = nodemailer.createTransport(smtp);

			_.merge(user, emailData);

			const mailOptions = {
				from: '"mugs" <foo@blurdybloop.com>', // sender address
				to: user.email, // list of receivers
				subject: 'Confirmation from mugs', // Subject line
				text: '', // plaintext body
				html: template(user),
			};

			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					return reject(error);
				}
				return resolve(info);
			});
		});
	});
}

module.exports = {
	recover: (user, config) => {
		const templatePath = '/email_templates/recoverpass.hbs';
		const emailData = { resetPassLink: '/reset/' + user.resetPasswordToken }; // eslint-disable-line
		mailController(user, config.smtp, templatePath, emailData);
	},
	confirmation: (user, config) => {
		const templatePath = '/email_templates/confirmation.hbs';
		const emailData = { confirmLink: 'http://www.test.dk', appName: 'mugs', logoLink: 'http://www.free-logotypes.com/logos/png/Win_95.png' };
		mailController(user, config.smtp, templatePath, emailData);
	},
};

