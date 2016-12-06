const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

module.exports = function(smtp, templatePath, emailData) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path.join(__dirname, templatePath), 'utf8', function(err, fileContents) { // eslint-disable-line 
			if (err) {
				return reject(err);
			}

			const template = handlebars.compile(fileContents);
			const transporter = nodemailer.createTransport(smtp);

			const mailConfiguration = {
				from: '"mugs" <foo@blurdybloop.com>', // sender address
				to: emailData.email, // list of receivers
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
