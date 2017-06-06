const jsonwebtoken = require('jsonwebtoken');
const chalk = require('chalk');

module.exports = function(token, complete = false) {
	const decoded = jsonwebtoken.decode(token, { json: true, complete });

	console.log('');

	if (decoded != null) {	
		console.log(JSON.stringify(decoded, null, 2));
	} else {
		console.log(chalk.red('The token was malformatted.'));
	}
};
