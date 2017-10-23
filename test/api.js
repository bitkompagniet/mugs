/* global define describe, xdescribe, it, xit, before, after */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const axios = require('axios');
const store = require('../store')('localhost:27017/mugs-unit-api');
const api = require('../api');
const server = require('../server');
const _ = require('lodash');

const should = chai.should(); // eslint-disable-line

chai.use(chaiAsPromised);

describe('api', function () {
	this.timeout(300000);

	const configuration = _.merge({}, {
		secret: 'ssh',
		appUrl: 'http://test.site',
		appName: 'Mugs Unit Tests',
		logoLink: 'http://unity-coding.slashgames.org/wp-content/uploads/unit-test.jpg',
		redirectConfirmUrl: 'http://test.site/confirm',
	}, process.env);

	const serverInstance = server(api(store, configuration));

	before(store.reset);

	const clientBaseSettings = {
		baseURL: 'http://localhost:3000',
		headers: {
			'Content-Type': 'application/json',
		},
		validateStatus: () => true,
	};

	function timeout(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}

	const client = axios.create(clientBaseSettings);

	const getData = data => data.data;
	const getResult = data => data.data.result;

	describe('POST /register', function() {
		it('should allow e-mail bob@bitkompagniet.dk, fullname Bob Doe and password !supersecret29', function() {
			this.timeout(5000);
			return client
				.post('/register', { email: 'bob@bitkompagniet.dk', fullname: 'Bob Doe', password: '!supersecret29' })
				.then(getResult)
				.then((user) => {
					should.exist(user);
					should.not.exist(user.confirmed);
				});
		});
	});

	describe('POST /login', function() {
		it('should be able to login with bob@bitkompagniet.dk:!supersecret29', function() {
			return client
				.post('/login', { email: 'bob@bitkompagniet.dk', password: '!supersecret29' })
				.then(getResult)
				.then((payload) => {
					should.exist(payload);
					payload.token.should.be.a('string');
					payload.user.should.be.an('object');
				});
		});

		it('should not be able to login with bob@bitkompagniet.dk:1234', function() {
			return client
				.post('/login', { email: 'bob@bitkompagniet.dk', password: '1234' })
				.then(getData)
				.then((data) => {
					data.code.should.equal(401);
					should.exist(data.error);
					data.error.should.contain('Invalid');
				});
		});
		it('should reject too many requests', async function() {
			for (let i = 0; i < 6; i += 1) {
				await client
				.post('/login', { email: 'admin@mugs.info', password: '1234' })
				.then(getData)
				.then((data) => {
					if (i > 5) { // checking after 5 tries since it depends how long time the request take to process.
						data.code.should.equal(429);
						should.exist(data.error);
						data.error.should.contain('locked');
					}
				});
			}
			console.log('Waiting for cooldown...');
			await timeout(3000);
			console.log('Continuing.');
		});
	});

	async function loginClient(email, password) {
		const payload = await client.post('/login', { email, password });
		payload.data.success.should.be.ok;
		const token = payload.data.result.token;
		return axios.create(_.merge({}, clientBaseSettings, { headers: { Authorization: token } }));
	}

	function authClient() {
		return loginClient('admin@mugs.info', 'admin');
	}

	describe('GET /me', function() {
		it('should not be accessible without Authorization header', function() {
			return client
				.get('/me')
				.then(getData)
				.then((data) => {
					data.code.should.equal(401);
					should.not.exist(data.result);
				});
		});

		it('should return a refresh token and the user when given a valid Authorization header token', function() {
			return authClient()
				.then(ac => ac.get('/me'))
				.then(getData)
				.then((data) => {
					data.code.should.equal(200);
					data.result.should.contain.all.keys('refresh', 'user');
				});
		});
	});

	describe('GET /verify/:token', function() {
		it('should be able to verify and renew a valid token', function() {
			let firstToken = null;

			return client
				.post('/login', { email: 'bob@bitkompagniet.dk', password: '!supersecret29' })
				.then(getResult)
				.then(payload => payload.token)
				.then((token) => {
					firstToken = token;
					return client.get(`/verify/${token}`);
				})
				.then(getData)
				.then((data) => {
					data.code.should.equal(200);
					should.exist(data.result);
					const payload = data.result;
					payload.refresh.should.be.a('string');
					payload.refresh.should.not.equal(firstToken);
				});
		});
	});

	describe('POST /', function() {
		it('should post a user correctly when using the admin login', async function() {
			const c = await authClient();
			const payload = await c.post('/', { email: 'test@test.dk', password: 'hest' });
			payload.data.success.should.be.ok;
			should.exist(payload.data.result.confirmed);
		});

		it('should be able to post both roles with and without scope with the created user (both in the form of an object and a string)', async function() {
			const c = await authClient();
			const payload = await c.post('/', { email: 'test2@test.dk', password: 'hest', roles: ['sag', 'sag@uh', { role: 'yoo' }, { role: 'yoo', scope: 'hmm' }] });
			should.exist(payload.data.result.roles);
			payload.data.result.roles.length.should.equal(6);
		});
	});

	describe('GET /:id', function() {
		it('should correctly retrieve a user we have access to', async function() {
			const c = await authClient();
			let payload = await c.post('/', { email: 'b@b.dk', password: 'hest' });
			payload.data.success.should.be.ok;
			const id = payload.data.result._id;
			payload = await c.get(`/${id}`);
			payload.data.success.should.be.ok;
			should.exist(payload.data.result);
			payload.data.result.email.should.equal('b@b.dk');
		});
	});

	describe('POST /:id/roles', function() {
		it('should post new roles when added administratively', async function() {
			const c = await authClient();
			let payload = await c.post('/', { email: 'c@c.dk', password: 'hest' });
			payload.data.success.should.be.ok;
			const id = payload.data.result._id;
			payload = await c.post(`/${id}/roles`, { role: 'editor', scope: 'websites' });
			payload.data.success.should.be.ok;
			let roles = payload.data.result.roles;
			roles.should.have.length(3);
			roles.filter(i => i.role === 'editor').should.have.length(1);
			payload = await c.get(`/${id}`);
			roles = payload.data.result.roles;
			roles.should.have.length(3);
			roles.filter(i => i.role === 'editor').should.have.length(1);
		});

		it('should not accept new roles when added by oneself', async function() {
			let payload = await client.post('/register', { email: 'd@d.dk', password: 'hest' });
			payload.data.success.should.be.ok;
			const c = await loginClient('d@d.dk', 'hest');
			payload = await c.get('/me');
			const me = payload.data.result.user;
			const id = me._id;
			me.roles.should.have.length(2);
			payload = await c.post(`/${id}/roles`, { role: 'editor', scope: 'websites' });
			payload.data.success.should.not.be.ok;
		});
	});

	describe('PUT /me/password', function() {
		it('should succeed and only respond to the new password when input is correct', async function() {
			let payload = await client.post('/register', { email: 'k@k.dk', password: 'hest' });
			payload.data.success.should.be.ok;
			let login = await client.post('/login', { email: 'k@k.dk', password: 'hest' });
			login.data.success.should.be.ok;

			const clientWithUser = await loginClient('k@k.dk', 'hest');
			payload = await clientWithUser.put('/me/password', { password: 'hest', repeated: 'hest', new: 'changed' });

			login = await client.post('/login', { email: 'k@k.dk', password: 'hest' });
			login.data.success.should.not.be.ok;

			login = await client.post('/login', { email: 'k@k.dk', password: 'changed' });
			login.data.success.should.be.ok;
		});

		it('should fail when old password was wrong', async function() {
			let payload = await client.post('/register', { email: 'fail@repeated.dk', password: 'hest' });
			payload.data.success.should.be.ok;

			const clientWithUser = await loginClient('fail@repeated.dk', 'hest');

			payload = await clientWithUser.put('/me/password', { password: 'hest2', repeated: 'hest2', new: 'changed' });
			payload.data.success.should.not.be.ok;

			const login = await client.post('/login', { email: 'fail@repeated.dk', password: 'changed' });
			login.data.success.should.not.be.ok;
			login.data.code.should.equal(401);
		});

		it('should fail when repeated password was wrong', async function() {
			let payload = await client.post('/register', { email: 'fail@repeated.dk', password: 'hest' });
			payload.data.success.should.be.ok;

			const clientWithUser = await loginClient('fail@repeated.dk', 'hest');

			payload = await clientWithUser.put('/me/password', { password: 'hest', repeated: 'hest2', new: 'changed' });
			payload.data.success.should.not.be.ok;

			const login = await client.post('/login', { email: 'fail@repeated.dk', password: 'changed' });
			login.data.success.should.not.be.ok;
			login.data.code.should.equal(401);
		});
	});

	describe('DELETE /:id', function() {
		it('should correctly remove the specified user', async function() {
			const c = await authClient();
			var payload = await c.post('/', { email: 'testToDelete@test.dk', password: 'test' });
			const userid = payload.data.result._id;
			
			payload = await c.get(`/`);
			const userCount = payload.data.result.length;
			
			payload = await c.delete(`/${userid}`);
			payload.data.success.should.be.ok;

			payload = await c.get(`/`);
			payload.data.result.should.have.length(userCount-1)

		});
	});
	
	after(() => {
		serverInstance.close();
	});
});
