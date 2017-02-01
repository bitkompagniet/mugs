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
	let serverInstance;

	before(async () => {
		await store.reset();

		const configuration = _.merge({}, {
			secret: 'ssh',
			appUrl: 'http://test.site',
			appName: 'Mugs Unit Tests',
			logoLink: 'http://unity-coding.slashgames.org/wp-content/uploads/unit-test.jpg',
			redirectConfirmUrl: 'http://test.site/confirm',
		}, process.env);

		serverInstance = server(api(store, configuration));
	});

	const clientBaseSettings = {
		baseURL: 'http://localhost:3000',
		headers: {
			'Content-Type': 'application/json',
		},
		validateStatus: () => true,
	};

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
	});

	async function authClient() {
		const payload = await client.post('/login', { email: 'admin@mugs.info', password: 'admin' });
		const token = payload.data.result.token;
		return axios.create(_.merge({}, clientBaseSettings, { headers: { Authorization: token } }));
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

	after(() => {
		serverInstance.close();
	});
});
