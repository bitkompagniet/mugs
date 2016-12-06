const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const _ = require('lodash');
const list = require('../query/list');
const rumor = require('rumor')('mugs:models:user');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

function oid() {
	return new ObjectId();
}

function passwordHash(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

function singleOrNull(result) {
	return (result && result.length && result.length === 1 && result[0]) || null;
}

function single(result) {
	if (result && result.length && result.length === 1) {
		return result[0];
	}

	throw new Error('Single element required, but object had unexpected length or was not an array.');
}

module.exports = function (db) {
	const userSchema = new Schema({
		// Required
		email: { type: String, required: true, index: { unique: true }, validate: value => validator.isEmail(value) },
		fullname: { type: String, required: true },
		password: { type: String, required: true, set: passwordHash },
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: null },
		confirmationToken: { type: Schema.Types.ObjectId, default: oid },
		confirmed: { type: Date, default: null },
		resetPasswordToken: { type: Schema.Types.ObjectId, default: null },
		roles: [{
			_id: false,
			role: String,
			group: String,
		}],
		data: {},
	}, {
		toJSON: {
			virtuals: true,
			transform(doc, ret) {
				delete ret.password;
				delete ret.__t;
				delete ret.__v;
				delete ret.confirmationToken;
				delete ret.resetPasswordToken;
			},
		},
	});

	userSchema.index({ email: 1, password: 1 });

	userSchema.statics.list = list;

	userSchema.statics.get = function(id) {
		return this.findById(id).then(res => res.toJSON());
	};

	userSchema.statics.getByEmail = function(email) {
		return this.find({ email })
			.then(singleOrNull)
			.then(res => (res && res.toJSON()) || null);
	};

	userSchema.statics.getByConfirmationToken = function(confirmationToken) {
		return this.find({ confirmationToken }).then(single).then(res => res.toJSON());
	};

	userSchema.statics.getByResetToken = function(resetPasswordToken) {
		return this.find({ resetPasswordToken }).then(single).then(res => res.toJSON());
	};

	userSchema.statics.getRaw = async function(id) {
		return await this.findById(id);
	};

	userSchema.statics.auth = async function(email, password) {
		const hash = passwordHash(password);

		const users = await this.find({ email, password: hash });
		if (users.length === 0) throw new Error('Wrong e-mail or password');

		const user = users[0];
		//if (!user.confirmed) throw new Error('The user was not confirmed.');

		return user.toJSON();
	};

	userSchema.statics.insert = async function(body) {
		const existing = await this.find({ email: body.email });
		if (existing.length > 0) throw new Error('E-mail already in use.');
		return (await this.create(body)).toJSON();
	};

	userSchema.statics.modify = async function(body) {
		const ignoreFields = ['_id', 'roles', 'password', 'confirmed', 'confirmationToken', 'resetPasswordToken', 'groups'];

		const model = await this.findById(body._id);
		if (!model) throw new Error('id in payload does not match any existing entity.');

		const cleanBody = _.omit(body, ignoreFields);
		_.merge(model, cleanBody);

		const err = model.validateSync();
		if (err) throw new Error(err);

		const result = await model.save();
		return result.toJSON();
	};

	userSchema.statics.addRole = function (_id, role, group) {
		return this.findOneAndUpdate({ _id }, {
			$addToSet: { roles: { role, group } },
		});
	};

	userSchema.statics.removeRole = function (_id, role, group) {
		return this.findOneAndUpdate({ _id }, {
			$pull: { roles: { role, group } },
		});
	};

	userSchema.statics.isEmailAvailable = function(email) {
		return this.getByEmail(email)
			.then(res => res === null);
	};

	userSchema.statics.register = function(user) {
		return this
			.create(user)
			.then(created => ({ _id: created._id, email: created.email, confirmationToken: created.confirmationToken }));
	};

	userSchema.statics.confirmRegistration = async function(confirmationToken) {
		const userWithToken = await this.findOne({ confirmationToken });

		if (userWithToken) {
			return await this.findOneAndUpdate({ _id: userWithToken._id }, {
				$set: {
					confirmationToken: null,
					confirmed: new Date(),
				},
			}, { new: true });
		}

		throw new Error('The user with the supplied confirmation token did not exist.');
	};

	userSchema.statics.requestRecoveryToken = function(email) {
		return this.getByEmail(email)
			.then(rumor.trace)
			.then((user) => {
				if (user.confirmed == null) throw new Error('Cannot request new password for unconfirmed user.');
				return user;
			})
			.then(user =>
				this.findOneAndUpdate({ _id: user._id }, {
					$set: {
						resetPasswordToken: new ObjectId(),
					},
				}, { new: true })
			)
			.then(rumor.trace)
			.then(user => user.resetPasswordToken);
	};

	return {
		users: db.model('User', userSchema),
	};
};
