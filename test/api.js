/* global define describe, xdescribe, it, xit, before, after */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rumor = require('rumor')('test:api');
const axios = require('axios');
const store = require('../store')('localhost:27017/mugs-unit-api');
const api = require('../api');
const server = require('../server');

const should = chai.should(); // eslint-disable-line

chai.use(chaiAsPromised);

describe('api', function () {
	let serverInstance;

	before(() =>
		store.reset().then(() => {
			serverInstance = server(api(store, { secret: 'ssh' }));
		})
	);

	const client = axios.create({
		baseURL: 'http://localhost:3000',
		headers: {
			'Content-Type': 'application/json',
		},
		validateStatus: () => true,
	});

	const getData = data => data.data;
	const getResult = data => data.data.result;

	describe('/register', function() {
		it('should allow e-mail bob@bitkompagniet.dk, fullname Bob Doe and password !supersecret29', function() {
			return client
				.post('/register', { email: 'bob@bitkompagniet.dk', fullname: 'Bob Doe', password: '!supersecret29' })
				.then(getResult)
				.then((user) => {
					should.exist(user);
					should.not.exist(user.confirmed);
				});
		});
	});

	describe('/login', function() {
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
					data.error.should.contain('Wrong');
				});
		});
	});

	after(() => {
		serverInstance.close();
	});
});
