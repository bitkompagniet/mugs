
const recoverTemplatePath = '/email_templates/confirmation.hbs';
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');



function mailController (user, smtp, templatePath, emailData) {
	fs.readFile(path.join(__dirname, templatePath), 'utf8', function(err, data) {
		if (err) {
			console.log(err);
		}

		if (user.confirmed != null) {
			throw new Error('User already confirmed');
		}

		const source = data;
		const template = handlebars.compile(source);

		console.log(template(user));

		const transporter = nodemailer.createTransport(smtp);

		const mailOptions = {
			from: '"mugs" <foo@blurdybloop.com>', // sender address
			to: user.email, // list of receivers
			subject: 'Confirmation from mugs', // Subject line
			text: '', // plaintext body
			html: template(user),
		};

		_.merge(mailOptions, emailData);

		return new Promise(function(resolve, reject) {
			transporter.sendMail(mailOptions, function(error, info) {
				console.log(error);
				if (error) {
					return reject(error);
				}
				return resolve(info);
			});
		});
	});
}

module.exports = {
	recover: (user, smtp) => {
		const templatePath = '/email_templates/recoverpass.hbs';
		const emailData = { resetPassLink: '/reset' + user.resetPasswordToken };
		mailController(user, smtp, templatePath, emailData);
	},
	confirmation: (user, smtp) => {
		const templatePath = '/email_templates/confirmation.hbs';
		mailController(user, smtp, templatePath, {});
	},
};

