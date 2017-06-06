# Mount on API

Add to the project:

```
npm i --save mugs
```

Then mount the application:

```javascript
const express = require('express');
const mugs = require('mugs');

const configuration = {
	appName: 'My application'
};

const app = express();
app.use(mugs(configuration));
```

# Unit tests

```
npm test
```

# Configuration

- `appName`: the application name, shown in e-mail.
- `appUrl`: the root URL to the application, used to prefix the links sent in e-mails.
- `db`: mongo URI for the user database.
- `smtp`: smtps string for sending e-mails.
- `senderEmail`: e-mail to use as From in system e-mails.
- `secret`: secret used to issue and verify JWT tokens.
- `logoLink`: URL to logo displayed in template.
- `redirectConfirmUrl`: URL used for confirmation redirection. Will receive `success` query param, and `message` on failure.
- `port`: port to start the process on.

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
	"roles": [{ role: String, scope: String }],
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

## User registration

Perform a new user registration. Will add the default roles to the user, and result in an unconfirmed user.

```
POST /register
```

### Body

| Name | Type | Required | Details |
|---|---|---|---|
| `email`     | `string` | yes  | The e-mail / username. |
| `password`  | `string` | yes  | Password for authentication. |
| `firstname` | `string` | no   | Firstname of user. Do not combine with `fullname`. |
| `lastname`  | `string` | no   | Lastname of user. Do not combine with `fullname`. |
| `fullname`  | `string` | no   | Firstname and lastname. Do not combine with the former. |
| `data`      | `object` | no   | Extra user data. |

### Response codes

| Code | Result |
|---|---|
| 200 | Successful registration |
| 400 | Bad request (wrong format of request payload) |
| 422 | Validation failure (missing required fields, etc. - details in `error`)

## Confirm registration

Given a valid `token`, will confirm the user.

```HTTP
GET /register/:token
```

### URL params

| Name | Type | Required |
|---|---|---|
| `token` | `string` | yes |

### Response codes

| Code | Result |
|---|---|
| 200 | User confirmed |
| 400 | Invalid token |

### Success response

The request will succeed with a redirection to the `redirectConfirmUrl`, appending a query string `?success=true`.

### Failure response

The request will fail with a redirection to the `redirectConfirmUrl`, appending a query string `?success=false&message=[reason]`.

## Create user (administratively)

Perform an administrative user creation. Can only be performed by an `admin@users`. Will add the default roles to the user, and result in a confirmed user. A role array can be added, but the user posting will need to be `admin` of each of the scopes in the array.

### Body

| Name | Type | Required | Details |
|---|---|---|---|
| `email`     | `string` | yes  | The e-mail / username. |
| `password`  | `string` | no   | Password for authentication. |
| `firstname` | `string` | no   | Firstname of user. Do not combine with `fullname`. |
| `lastname`  | `string` | no   | Lastname of user. Do not combine with `fullname`. |
| `fullname`  | `string` | no   | Firstname and lastname. Do not combine with the former. |
| `data`      | `object` | no   | Extra user data. |
| `roles`     | `array`  | no   | Extra user roles. |

#### The `roles` array

When provided, items in the `roles` array can be given in two formats. Either as an array of role strings (`role@scope`) or as objects:

| Name | Type | Required |
|---|---|---|---|
| `role`     | `string` | yes  |
| `scope`    | `string` | yes  |

The two formats can be mixed in the array.


## List users

List users in scopes you are member of.

```http
GET /
```

### Query

| Name | Type | Details |
|---|---|---|
| `role`           | `string` | Filter by users being in role.  It is still required that the requested user can view
| `lte[<field>]`   | `string` | Filter by `field` being less than or equal to value. |
| `gte[<field>]`   | `string` | Filter by `field` being greater than or equal to value. |
| `in[<field>]`    | `string` | `field` is equal to value. If given multiple times, match either one. |
| `match[<field>]` | `string` | Fuzzy match `field` - enable use of `*` and `?`. |
| `sort[<field>]`  | `int`    | Sort by `field`. `1` for ascending and `-1` for descending. Can be given multiple times. First defined, first in sort order. |
| `skip`           | `int`    | Skip the first *n* results. |
| `limit`          | `int`    | Return a max of *n* results. Useful for pagination in combination with **skip**. |


## Retrieve body of logged in user
Get body of logged in user. Requires a jwt token in either the cookies or the header.
```
GET /me
```
### Response codes
| Code | Result |
|---|---|
| 200 | Confirmed |
| 400 | Invalid token |



## Modify a user
Modify given user.
```
PUT /:id
```
### Body
| Name | Type | Details |
|---|---|---|---|
| `email`     | `string` | The e-mail / username. |
| `password`  | `string` | Password for authentication. |
| `firstname` | `string` | Firstname of user. Do not combine with `fullname`. |
| `lastname`  | `string` | Lastname of user. Do not combine with `fullname`. |
| `fullname`  | `string` | Firstname and lastname. Do not combine with the former. |

 - To modify a users role you use POST /:id/roles
 - To modify a users data you use POST /:id/data

 ### Response codes
| Code | Result |
|---|---|
| 200 | Confirmed |
| 400 | Invalid token |
| 403 | Permission denied |