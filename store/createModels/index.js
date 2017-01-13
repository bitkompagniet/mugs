const mongoose = require('mongoose');
const validator = require('validator');
const list = require('../query/list');
const requestRecoveryToken = require('../query/requestRecoveryToken');
const confirmRegistration = require('../query/confirmRegistration');
const register = require('../query/register');
const isEmailAvailable = require('../query/isEmailAvailable');
const removeRole = require('../query/removeRole');
const addRole = require('../query/addRole');
const modify = require('../query/modify');
const insert = require('../query/insert');
const auth = require('../query/auth');
const passwordHash = require('../util/passwordHash');
const getRaw = require('../query/getRaw');
const getByResetToken = require('../query/getByResetToken');
const getByConfirmationToken = require('../query/getByConfirmationToken');
const getByEmail = require('../query/getByEmail');
const get = require('../query/get');
const deleteUser = require('../query/delete');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (db) {
	const userSchema = new Schema({
		// Required
		email: { type: String, required: true, index: { unique: true }, validate: value => validator.isEmail(value) },
		firstname: { type: String, required: false },
		lastname: { type: String, required: false },
		password: { type: String, required: true, set: passwordHash },
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: null },
		confirmationToken: { type: Schema.Types.ObjectId, default: () => new ObjectId() },
		confirmed: { type: Date, default: null },
		resetPasswordToken: { type: Schema.Types.ObjectId, default: null },
		roles: [{
			_id: false,
			role: String,
			scope: String,
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

	userSchema.virtual('fullname').get(function() {
		return [this.firstname, this.lastname].filter(i => !!i).join(' ');
	});
	userSchema.statics.list = list;
	userSchema.statics.get = get;
	userSchema.statics.getByEmail = getByEmail;
	userSchema.statics.getByConfirmationToken = getByConfirmationToken;
	userSchema.statics.getByResetToken = getByResetToken;
	userSchema.statics.getRaw = getRaw;
	userSchema.statics.auth = auth;
	userSchema.statics.insert = insert;
	userSchema.statics.modify = modify;
	userSchema.statics.addRole = addRole;
	userSchema.statics.removeRole = removeRole;
	userSchema.statics.isEmailAvailable = isEmailAvailable;
	userSchema.statics.register = register;
	userSchema.statics.confirmRegistration = confirmRegistration;
	userSchema.statics.requestRecoveryToken = requestRecoveryToken;
	userSchema.statics.delete = deleteUser;

	return {
		users: db.model('User', userSchema),
	};
};
