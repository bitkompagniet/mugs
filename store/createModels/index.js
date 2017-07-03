const mongoose = require('mongoose');
const validator = require('validator');
const list = require('../query/list');
const requestRecoveryToken = require('../query/requestRecoveryToken');
const confirmRegistration = require('../query/confirmRegistration');
const register = require('../query/register');
const isEmailAvailable = require('../query/isEmailAvailable');
const removeRoles = require('../query/remove-roles');
const addRoles = require('../query/add-roles');
const modify = require('../query/modify');
const insert = require('../query/insert');
const auth = require('../query/auth');
const passwordHash = require('../util/passwordHash');
const getByResetToken = require('../query/getByResetToken');
const getByConfirmationToken = require('../query/getByConfirmationToken');
const getByEmail = require('../query/getByEmail');
const get = require('../query/get');
const insertUserData = require('../query/insertUserData');
const getUserData = require('../query/getUserData');
const deleteUser = require('../query/delete');
const configureDefaultRoles = require('../query/configure-default-roles');
const modifyUserData = require('../query/modify-user-data');
const changePassword = require('../query/change-password');


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
		failedAttempts: { type: Number, default: 0 },
		locked: { type: Date, default: null },
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
	userSchema.statics.auth = auth;
	userSchema.statics.insert = insert;
	userSchema.statics.modify = modify;
	userSchema.statics.addRoles = addRoles;
	userSchema.statics.removeRoles = removeRoles;
	userSchema.statics.isEmailAvailable = isEmailAvailable;
	userSchema.statics.register = register;
	userSchema.statics.confirmRegistration = confirmRegistration;
	userSchema.statics.requestRecoveryToken = requestRecoveryToken;
	userSchema.statics.insertUserData = insertUserData;
	userSchema.statics.getUserData = getUserData;
	userSchema.statics.delete = deleteUser;
	userSchema.statics.configureDefaultRoles = configureDefaultRoles;
	userSchema.statics.modifyUserData = modifyUserData;
	userSchema.statics.changePassword = changePassword;

	return {
		users: db.model('User', userSchema),
	};
};
