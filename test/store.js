/* global define describe, xdescribe, it, xit, before, after */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const store = require('../store')('localhost:27017/mugs-unit-store');
const rumor = require('rumor')('test:store');

const should = chai.should(); // eslint-disable-line

chai.use(chaiAsPromised);

describe('store', function () {
	this.timeout(20000);
	before(store.reset);

	const testUsers = [
		{ email: 'bob@bitkompagniet.dk', fullname: 'Bob Doe', password: '123' },
		{ email: 'jane@bitkompagniet.dk', fullname: 'Jane Doe', password: '123' },
		{ email: 'john@bitkompagniet.dk', fullname: 'John Doe', password: 'somepass' },
	];

	const createUser = () => store.insert(testUsers[0]);
	const createAll = () => Promise.all(testUsers.map(user => store.insert(user)));

	describe('.insert', function () {
		it('should be able to create and read back a user', function() {
			return store.reset()
				.then(() => createUser())
				.then(({ _id }) => store.get(_id))
				.then(rumor.debug)
				.then((res) => {
					should.exist(res);
					res.should.contain.all.keys('_id', 'email', 'fullname', 'confirmed', 'created', 'id', 'roles', 'updated');
				});
		});

		it('should confirm the user directly', async function() {
			await store.reset();
			const user = await createUser();
			should.not.exist(user.confirmationToken);
			should.exist(user.confirmed);
			user.confirmed.should.be.instanceof(Date);
		});
	});

	describe('.update', function() {
		it('should be able to modify a user', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.modify(user._id, Object.assign(user, { firstname: 'Alice' })))
				.should.be.fulfilled
				.then((res) => {
					should.exist(res);
					res.email.should.equal('bob@bitkompagniet.dk');
					res.firstname.should.equal('Alice');
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
				.then(user => store.modify(user._id, Object.assign(user, { email: 'invalid' })))
				.should.be.rejected;
		});

		it('should silently ignore an attempt to set roles in a modify action', function() {
			return store.reset()
				.then(() => createUser())
				.then(user => store.modify(user._id, Object.assign(user, { roles: ['user-manager'] })))
				.should.be.fulfilled
				.then((res) => {
					res.roles.should.have.length(2);
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
					res.should.have.length(testUsers.length + 1);
				});
		});

		it('should correctly return 2 users when we set the limit to 2', function() {
			return store.reset()
				.then(() => createAll())
				.then(() => store.list({ sort: 'email', limit: 2 }))
				.then((res) => {
					res.should.be.an('array');
					res.should.have.length(2);
				});
		});

		it('should return the second when we set skip to 1 and limit to 1', function() {
			return store.reset()
				.then(() => createAll())
				.then(() => store.list({ sort: 'email', skip: 1, limit: 1 }))
				.then((res) => {
					res.should.be.an('array');
					res.should.have.length(1);
				});
		});
	});

	describe('.addRoles', function() {
		it('should be able to add a role to an existing user', async function() {
			await store.reset();
			const user = await createUser();
			user.should.have.property('roles').that.has.length(2);
			await store.addRoles(user._id, [{ role: 'admin', scope: 'admins' }]);

			const fetchedUser = await store.get(user._id);
			const roles = fetchedUser.roles;
			roles.should.be.an('array');
			roles.should.have.length(3);
		});
	});

	describe('.removeRoles', function() {
		it('should be able to remove a role from an existing user', async function() {
			await store.reset();
			let user = await createUser();
			user = await store.addRoles(user._id, [{ role: 'admin', scope: 'admins' }]);
			user.should.have.property('roles').that.has.length(3);
			user = await store.removeRoles(user._id, [{ role: 'admin', scope: 'admins' }]);
			user.should.have.property('roles').that.has.length(2);

			return;
		});
	});

	xdescribe('.confirm', function() {
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
});
