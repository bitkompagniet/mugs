/* global define describe, xdescribe, it, xit, before, after */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const store = require('../store')('localhost:27017');
const rumor = require('rumor')('fuchsia');

const should = chai.should(); // eslint-disable-line

chai.use(chaiAsPromised);

describe('store', function () {
	before(() => store.reset());
	this.timeout(20000);

	const testUsers = [
		{ email: 'bob@bitkompagniet.dk', fullname: 'Bob Doe', password: '123' },
		{ email: 'jane@bitkompagniet.dk', fullname: 'Jane Doe', password: '123' },
		{ email: 'john@bitkompagniet.dk', fullname: 'John Doe', password: 'somepass' },
	];

	const createUser = () => store.create(testUsers[0]);
	const createAll = () => Promise.all(testUsers.map(user => store.create(user)));

	describe('.create', function () {
		it('should be able to create and read back a user', function() {
			return store.reset()
				.then(() => createUser())
				.then(({ _id }) => store.get(_id))
				.then(rumor.debug)
				.then((res) => {
					should.exist(res);
					res.should.contain.all.keys('_id', 'email', 'fullname', 'password');
					res.password.should.not.equal('hattefar');
				})
				.catch(rumor.error);
		});
	});

	describe('.update', function() {
		it('should be able to modify a user', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.modify(Object.assign(user, { fullname: 'Alice' })))
				.should.be.fulfilled
				.then((res) => {
					should.exist(res);
					res.email.should.equal('bob@bitkompagniet.dk');
					res.fullname.should.equal('Alice');
				});
		});

		it('should fail when we try to update a user that does not exist', function() {
			return store.reset()
				.then(() => store.modify({ _id: '123', fullname: 'Alice ' }))
				.should.be.rejected;
		});

		it('should fail when we try to set the e-mail to something invalid', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.modify(Object.assign(user, { email: 'invalid' })))
				.should.be.rejected;
		});

		it('should silently ignore an attempt to set roles in a modify action', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.modify(Object.assign(user, { roles: ['user-manager'] })))
				.should.be.fulfilled
				.then((res) => {
					res.roles.should.have.length(0);
				});
		});
	});

	describe('.list', function() {
		it('should correctly return the full list of users with no args', function() {
			return store.reset()
				.then(() => createAll())
				.then(() => store.list())
				.then((res) => {
					res.should.be.an('array');
					res.should.have.length(testUsers.length);
				});
		});

		it('should correctly return 2 users when we set the limit to 2', function() {
			return store.reset()
				.then(() => createAll())
				.then(() => store.list({ sort: 'email', limit: 2 }))
				.then((res) => {
					res.should.be.an('array');
					res.should.have.length(2);
					res[0].fullname.should.equal(testUsers[0].fullname);
				});
		});

		it('should return the second when we set skip to 1 and limit to 1', function() {
			return store.reset()
				.then(() => createAll())
				.then(() => store.list({ sort: 'email', skip: 1, limit: 1 }))
				.then((res) => {
					res.should.be.an('array');
					res.should.have.length(1);
					res[0].fullname.should.equal(testUsers[1].fullname);
				});
		});
	});

	describe('.addRole', function() {
		it('should be able to add the "user-manager" role to an existing user', function() {
			return store.reset()
				.then(() => createUser())
				.then((user) => {
					user.should.have.property('roles').that.is.empty;
					return user._id;
				})
				.then(_id =>
					store.addRole(_id, 'user-manager').then(() => store.get(_id))
				)
				.should.eventually.have.property('roles').that.is.not.empty
				.then(roles => roles[0].should.equal('user-manager'));
		});
	});

	describe('.removeRole', function() {
		it('should be able to remove the "user-manager" role from an existing user', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.addRole(user._id, 'user-manager').then(() => store.get(user._id)))
				.then(user => store.removeRole(user._id, 'user-manager').then(() => store.get(user._id)))
				.should.eventually.have.property('roles').that.is.empty;
		});
	});

	describe('.confirm', function() {
		it('should set the date correctly after confirmation', function() {
			return store.reset()
				.then(() => createUser())
				.then((user) => {
					user.should.have.property('confirmed').that.is.null;
					return store.confirm(user.email, user.confirmationToken);
				})
				.then((user) => {
					user.should.have.property('confirmed').that.is.a('date');
				});
		});
	});

	describe('.requestRecoveryToken', function() {
		it('should throw if we try to request a token for an unconfirmed user', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.requestRecoveryToken(user.email))
				.should.be.rejected;
		});
	});
});
