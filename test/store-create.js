/* global define describe, xdescribe, it, xit, before, after */

const should = require('chai').should(); // eslint-disable-line
const store = require('../store')('localhost:27017');
const rumor = require('rumor')('fuchsia');

rumor.info('shiit');

describe('store', function () {

	// before(() => store.reset());

	describe('.create', function() {
		it('should be able to create and read back a user', function() {
			return store.create({ username: 'parkov' })
				.then(rumor.debug)
				.then(({ _id }) => store.get(_id))
				.then(rumor.debug)
				.then((res) => {
					should.exist(res);
				});
		});
	});
});