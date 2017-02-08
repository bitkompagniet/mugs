# How to run unit tests

```
smtp=smtps://username:password@smtp.gmail.com:465 npm test
```

# ENV vars

## Mandatory

- `appName`: the application name, shown in e-mail.
- `appUrl`: the root URL to the application, used to prefix the links sent in e-mails.
- `db`: mongo URI for the user database.
- `smtp`: smtps string for sending e-mails.
- `secret`: secret used to issue and verify JWT tokens.
- `logoLink`: URL to logo displayed in template.
- `redirectConfirmUrl`: URL used for confirmation redirection. Will receive `success` query param, and `message` on failure.

## Optional

- `rumor`: trace level.

# User model

```javascript
{
	"id": MongoId,
	"email": String,
	"firstname": String,
	"lastname": String,
	"fullname": String,
	"password": String,
	"created": Date,
	"updated": Date,
	"confirmationToken": MongoId,
	"confirmed": Date,
	"resetPasswordToken": MongoId,
	"roles": [{ role: String, group: String }],
	"data": {},
}
```

# Command line

You can sign a test user token with:

```bash
npm run sign -- [--secret <secret>] [--clean] [...roles]
```

Roles are space-separated roles on the `role@scope` form. `secret` is optional, and will default to `ssh`. The expiry period will be set to 7 days on creation. `clean` can be set to suppress adding default user roles.

# Endpoints

## `POST` /register

Perform a new user registration. Will add the default roles to the user, and result in an unconfirmed user.

### Body

```javascript
{
	"email": { type: String, required: true },
	"password": { type: String, required: true },
	"firstname": String,
	"lastname": String,
	"data": {},
}
```

### Response codes

- `200`: New user registered
- `400`: Validation failure

## `GET` /register/:token

Given a valid `token`, will confirm the user.

### Params

- `token`: the registration token that was e-mailed to the user.

### Response codes

- `200`: Confirmation successful
- `400`: Invalid token

### Success response

The request will succeed with a redirection to the `redirectConfirmUrl`, appending a query string `?success=true`.

### Failure response

The request will fail with a redirection to the `redirectConfirmUrl`, appending a query string `?success=false&message=[reason]`.

## `POST` /

Perform an administrative user creation. Can only be performed by an `admin@users`. Will add the default roles to the user, and result in a confirmed user. A role array can be added, but the user posting will need to be `admin` of each of the scopes in the array.

### Body

```javascript
{
	"email": { type: String, required: true },
	"password": { type: String, required: true },
	"firstname": String,
	"lastname": String,
	"data": {},
	"roles": [{
		role: { type: String, required: true },
		scope: { type: String, required: true },
	}],
}
```