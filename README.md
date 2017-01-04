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