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
		roles: [String],
		groups: [String],
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

	userSchema.statics.auth = function(email, password) {
		const hash = passwordHash(password);
		return this.find({ email, password: hash }).then(singleOrNull).then(res => res.toJSON());
	};

	userSchema.statics.modify = function(body) {
		const ignoreFields = ['_id', 'roles', 'password', 'confirmed', 'confirmationToken', 'resetPasswordToken', 'groups'];

		return this.findById(body._id)
			.then((model) => {
				if (!model) throw new Error('id in model does not match any existing entity.');

				const cleanBody = _.omit(body, ignoreFields);
				_.merge(model, cleanBody);

				const err = model.validateSync();
				if (err) throw new Error(err);

				return model
					.save()
					.then(user => user.toJSON());
			});
	};

	userSchema.statics.addRole = function (_id, role) {
		return this.findOneAndUpdate({ _id }, {
			$addToSet: { roles: role },
		});
	};

	userSchema.statics.removeRole = function (_id, role) {
		return this.findOneAndUpdate({ _id }, {
			$pull: { roles: role },
		});
	};

	userSchema.statics.addToGroup = function (_id, group) {
		return this.findOneAndUpdate({ _id }, {
			$addToSet: { groups: group },
		});
	};

	userSchema.statics.removeFromGroup = function(_id, group) {
		return this.findOneAndUpdate({ _id }, {
			$pull: { groups: group },
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

	userSchema.statics.confirmRegistration = function(email, confirmationToken) {
		return this.getByEmail(email)
			.then((user) => {
				rumor.info(user);
				if (!user.confirmationToken.equals(confirmationToken)) throw new Error('Confirmation tokens did not match.');
				return user;
			})
			.then(user => this.findOneAndUpdate({ _id: user._id }, {
				$set: {
					confirmationToken: null,
					confirmed: new Date(),
				},
			}, { new: true }));
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
