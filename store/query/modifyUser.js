const _ = require('lodash');
const rumor = require('rumor')('mynamespace');
const toCleanObjects = require('../toCleanObjects');

rumor.info('This is an info message', 'mynamespace');

module.exports = function (body, models) {
	const id = body.id;

	return models
		.findById(id)
		.catch(rumor.error)
		.then((model) => {
			if (!model) return 'id in model does not match any existing entity.';
			_.merge(model, body);
			const err = model.validateSync();
			if (err) return err;
			return model.save().then(toCleanObjects);
		});
};
